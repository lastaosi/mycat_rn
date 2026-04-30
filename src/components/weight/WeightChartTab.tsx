import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Pressable,
  Alert,
  ScrollView,
} from "react-native";
import {
  VictoryChart,
  VictoryLine,
  VictoryAxis,
  VictoryScatter,
  VictoryTheme,
} from "victory-native";
import { WeightRecord } from "../../database/weightRepository";
import { colors } from "../../styles/common";

type Props = {
  records: WeightRecord[];
  onAdd: (weightG: number, memo: string | null) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
};

export default function WeightChartTab({ records, onAdd, onDelete }: Props) {
  const [weightInput, setWeightInput] = useState("");
  const [memoInput, setMemoInput] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  async function handleAdd() {
    const kg = parseFloat(weightInput);
    if (isNaN(kg) || kg <= 0) {
      Alert.alert("알림", "올바른 체중을 입력해주세요");
      return;
    }
    setIsSaving(true);
    try {
      await onAdd(Math.round(kg * 1000), memoInput || null);
      setWeightInput("");
      setMemoInput("");
    } catch {
      Alert.alert("오류", "저장 중 오류가 발생했습니다");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(id: number) {
    Alert.alert("삭제", "이 기록을 삭제할까요?", [
      { text: "취소", style: "cancel" },
      {
        text: "삭제",
        style: "destructive",
        onPress: async () => {
          try {
            await onDelete(id);
          } catch {
            Alert.alert("오류", "삭제 중 오류가 발생했습니다");
          }
        },
      },
    ]);
  }

  function formatWeight(weightG: number): string {
    return (weightG / 1000).toFixed(2) + " kg";
  }

  function formatDate(timestamp: number): string {
    const date = new Date(timestamp);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  }

  function formatFullDate(timestamp: number): string {
    return new Date(timestamp).toLocaleDateString("ko-KR");
  }

  // 차트 데이터 변환
  const chartData = records.map((r, index) => ({
    x: index + 1,
    y: r.weightG / 1000,
    label: formatDate(r.recordedAt),
  }));

  return (
    <ScrollView style={styles.container}>
      {/* 차트 */}
      {records.length >= 2 ? (
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>체중 추이</Text>
          <VictoryChart
            theme={VictoryTheme.material}
            height={220}
            padding={{ top: 20, bottom: 40, left: 50, right: 20 }}
          >
            <VictoryAxis
              tickFormat={(t) => {
                const record = records[t - 1];
                return record ? formatDate(record.recordedAt) : "";
              }}
              style={{ tickLabels: { fontSize: 10, fill: "#888" } }}
            />
            <VictoryAxis
              dependentAxis
              tickFormat={(t) => `${t}kg`}
              style={{ tickLabels: { fontSize: 10, fill: "#888" } }}
            />
            <VictoryLine
              data={chartData}
              style={{ data: { stroke: "#FF6B6B", strokeWidth: 2 } }}
              animate={{ duration: 500 }}
            />
            <VictoryScatter
              data={chartData}
              size={4}
              style={{ data: { fill: "#FF6B6B" } }}
            />
          </VictoryChart>

          {/* 최근 체중 */}
          {records.length > 0 && (
            <View style={styles.latestWeight}>
              <Text style={styles.latestLabel}>최근 체중</Text>
              <Text style={styles.latestValue}>
                {formatWeight(records[records.length - 1].weightG)}
              </Text>
            </View>
          )}
        </View>
      ) : (
        <View style={styles.chartPlaceholder}>
          <Text style={styles.placeholderText}>
            📊 기록이 2개 이상이면 차트가 표시돼요
          </Text>
        </View>
      )}

      {/* 입력 영역 */}
      <View style={styles.inputCard}>
        <Text style={styles.inputTitle}>체중 추가</Text>
        <TextInput
          style={styles.input}
          value={weightInput}
          onChangeText={setWeightInput}
          placeholder="체중 입력 (kg)"
          keyboardType="decimal-pad"
        />
        <TextInput
          style={styles.input}
          value={memoInput}
          onChangeText={setMemoInput}
          placeholder="메모 (선택)"
        />
        <Pressable
          style={[styles.addButton, isSaving && styles.addButtonDisabled]}
          onPress={handleAdd}
          disabled={isSaving}
        >
          <Text style={styles.addButtonText}>
            {isSaving ? "저장 중..." : "+ 추가"}
          </Text>
        </Pressable>
      </View>

      {/* 기록 목록 */}
      <View style={styles.recordList}>
        <Text style={styles.recordListTitle}>기록 목록</Text>
        {records.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>체중 기록이 없어요</Text>
            <Text style={styles.emptySubText}>
              첫 번째 기록을 추가해봐요 🐱
            </Text>
          </View>
        ) : (
          [...records].reverse().map((item) => (
            <View key={item.id} style={styles.recordCard}>
              <View style={styles.recordInfo}>
                <Text style={styles.recordWeight}>
                  {formatWeight(item.weightG)}
                </Text>
                <Text style={styles.recordDate}>
                  {formatFullDate(item.recordedAt)}
                </Text>
                {item.memo && (
                  <Text style={styles.recordMemo}>{item.memo}</Text>
                )}
              </View>
              <Pressable onPress={() => handleDelete(item.id)}>
                <Text style={styles.deleteButton}>🗑️</Text>
              </Pressable>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  chartCard: {
    backgroundColor: colors.white,
    margin: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: colors.cardShadow,
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 8,
  },
  chartPlaceholder: {
    margin: 16,
    padding: 24,
    backgroundColor: colors.white,
    borderRadius: 12,
    alignItems: "center",
  },
  placeholderText: { color: colors.subText, fontSize: 14 },
  latestWeight: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  latestLabel: { fontSize: 14, color: colors.subText },
  latestValue: { fontSize: 18, fontWeight: "bold", color: colors.primary },
  inputCard: {
    backgroundColor: colors.white,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    gap: 8,
    shadowColor: colors.cardShadow,
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  inputTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 4,
  },
  input: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  addButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
  },
  addButtonDisabled: { opacity: 0.5 },
  addButtonText: { color: colors.white, fontWeight: "bold", fontSize: 16 },
  recordList: { marginHorizontal: 16, marginBottom: 32 },
  recordListTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 12,
  },
  recordCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: colors.cardShadow,
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  recordInfo: { flex: 1 },
  recordWeight: { fontSize: 18, fontWeight: "bold", color: colors.text },
  recordDate: { fontSize: 13, color: colors.subText, marginTop: 2 },
  recordMemo: { fontSize: 13, color: "#555", marginTop: 4 },
  deleteButton: { fontSize: 20, paddingLeft: 8 },
  emptyContainer: { alignItems: "center", paddingVertical: 32 },
  emptyText: { fontSize: 16, fontWeight: "bold", color: "#555" },
  emptySubText: { fontSize: 14, color: colors.subText, marginTop: 8 },
});
