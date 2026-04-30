import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { colors } from "../styles/common";
import { useVaccination } from "../hooks/useVaccination";
import { VaccinationRecord } from "../database/vaccinationRepository";

type Props = {
  catId: number;
};

export default function VaccinationScreen({ catId }: Props) {
  const router = useRouter();
  const { records, isLoading, addVaccination, removeVaccination } =
    useVaccination(catId);

  const [vaccineName, setVaccineName] = useState("");
  const [vaccinatedAt, setVaccinatedAt] = useState("");
  const [nextDueAt, setNextDueAt] = useState("");
  const [memo, setMemo] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);

  async function handleSave() {
    if (!vaccineName.trim()) {
      Alert.alert("알림", "백신 이름을 입력해주세요");
      return;
    }
    if (!vaccinatedAt.trim()) {
      Alert.alert("알림", "접종일을 입력해주세요");
      return;
    }
    setIsSaving(true);
    try {
      await addVaccination(
        vaccineName.trim(),
        vaccinatedAt.trim(),
        nextDueAt.trim() || null,
        memo.trim() || null,
      );
      setVaccineName("");
      setVaccinatedAt("");
      setNextDueAt("");
      setMemo("");
      setShowForm(false);
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
            await removeVaccination(id);
          } catch {
            Alert.alert("오류", "삭제 중 오류가 발생했습니다");
          }
        },
      },
    ]);
  }

  // 다음 접종일 D-day 계산
  function getDday(nextDueAt: string): string {
    const today = new Date();
    const due = new Date(nextDueAt);
    const diff = Math.ceil(
      (due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
    );
    if (diff === 0) return "D-Day";
    if (diff > 0) return `D-${diff}`;
    return `D+${Math.abs(diff)}`;
  }

  function getDdayColor(nextDueAt: string): string {
    const today = new Date();
    const due = new Date(nextDueAt);
    const diff = Math.ceil(
      (due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
    );
    if (diff < 0) return "#FF3B30"; // 지남 — 빨강
    if (diff <= 7) return "#FF9500"; // 7일 이내 — 주황
    return "#34C759"; // 여유 — 초록
  }

  function renderRecord(item: VaccinationRecord) {
    return (
      <View key={item.id} style={styles.recordCard}>
        <View style={styles.recordLeft}>
          <Text style={styles.vaccineName}>{item.vaccineName}</Text>
          <Text style={styles.recordDate}>접종일: {item.vaccinatedAt}</Text>
          {item.nextDueAt && (
            <Text style={styles.recordDate}>다음 접종: {item.nextDueAt}</Text>
          )}
          {item.memo && <Text style={styles.recordMemo}>{item.memo}</Text>}
        </View>
        <View style={styles.recordRight}>
          {item.nextDueAt && (
            <Text
              style={[styles.dday, { color: getDdayColor(item.nextDueAt) }]}
            >
              {getDday(item.nextDueAt)}
            </Text>
          )}
          <Pressable onPress={() => handleDelete(item.id)}>
            <Text style={styles.deleteButton}>🗑️</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B6B" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.backButton}>← 뒤로</Text>
        </Pressable>
        <Text style={styles.title}>💉 예방접종</Text>
        <Pressable onPress={() => setShowForm(!showForm)}>
          <Text style={styles.addHeaderButton}>
            {showForm ? "닫기" : "+ 추가"}
          </Text>
        </Pressable>
      </View>

      <ScrollView>
        {/* 입력 폼 */}
        {showForm && (
          <View style={styles.formCard}>
            <Text style={styles.formTitle}>예방접종 추가</Text>
            <TextInput
              style={styles.input}
              value={vaccineName}
              onChangeText={setVaccineName}
              placeholder="백신 이름 (예: 종합백신)"
            />
            <TextInput
              style={styles.input}
              value={vaccinatedAt}
              onChangeText={setVaccinatedAt}
              placeholder="접종일 (예: 2024-01-15)"
            />
            <TextInput
              style={styles.input}
              value={nextDueAt}
              onChangeText={setNextDueAt}
              placeholder="다음 접종일 (선택)"
            />
            <TextInput
              style={styles.input}
              value={memo}
              onChangeText={setMemo}
              placeholder="메모 (선택)"
            />
            <Pressable
              style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
              onPress={handleSave}
              disabled={isSaving}
            >
              <Text style={styles.saveButtonText}>
                {isSaving ? "저장 중..." : "저장"}
              </Text>
            </Pressable>
          </View>
        )}

        {/* 기록 목록 */}
        <View style={styles.listContainer}>
          {records.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>예방접종 기록이 없어요</Text>
              <Text style={styles.emptySubText}>
                + 추가 버튼을 눌러 기록해봐요 💉
              </Text>
            </View>
          ) : (
            records.map(renderRecord)
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 60,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  backButton: { fontSize: 16, color: colors.primary },
  title: { fontSize: 20, fontWeight: "bold" },
  addHeaderButton: { fontSize: 16, color: colors.primary, fontWeight: "bold" },
  formCard: {
    backgroundColor: colors.white,
    margin: 16,
    borderRadius: 12,
    padding: 16,
    gap: 8,
    shadowColor: colors.cardShadow,
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  formTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 4 },
  input: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    marginTop: 4,
  },
  saveButtonDisabled: { opacity: 0.5 },
  saveButtonText: { color: colors.white, fontWeight: "bold", fontSize: 16 },
  listContainer: { paddingHorizontal: 16, paddingBottom: 32 },
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
  recordLeft: { flex: 1 },
  recordRight: { alignItems: "center", gap: 8 },
  vaccineName: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 4,
  },
  recordDate: { fontSize: 13, color: colors.subText },
  recordMemo: { fontSize: 13, color: "#555", marginTop: 4 },
  dday: { fontSize: 14, fontWeight: "bold" },
  deleteButton: { fontSize: 20 },
  emptyContainer: { alignItems: "center", paddingVertical: 60 },
  emptyText: { fontSize: 16, fontWeight: "bold", color: "#555" },
  emptySubText: { fontSize: 14, color: colors.subText, marginTop: 8 },
});
