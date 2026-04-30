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
import { useMedication } from "../hooks/useMedication";
import { Medication } from "../database/medicationRepository";

type Props = {
  catId: number;
};

export default function MedicationScreen({ catId }: Props) {
  const router = useRouter();
  const {
    activeMedications,
    completedMedications,
    isLoading,
    addMedication,
    removeMedication,
  } = useMedication(catId);

  const [name, setName] = useState("");
  const [dosage, setDosage] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [memo, setMemo] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);

  async function handleSave() {
    if (!name.trim()) {
      Alert.alert("알림", "약 이름을 입력해주세요");
      return;
    }
    if (!startDate.trim()) {
      Alert.alert("알림", "시작일을 입력해주세요");
      return;
    }
    setIsSaving(true);
    try {
      await addMedication(
        name.trim(),
        dosage.trim() || null,
        startDate.trim(),
        endDate.trim() || null,
        memo.trim() || null,
      );
      setName("");
      setDosage("");
      setStartDate("");
      setEndDate("");
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
            await removeMedication(id);
          } catch {
            Alert.alert("오류", "삭제 중 오류가 발생했습니다");
          }
        },
      },
    ]);
  }

  // 투약 진행 상태 계산
  function getProgress(startDate: string, endDate: string | null): string {
    if (!endDate) return "진행 중";
    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    const total = Math.ceil(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
    );
    const elapsed = Math.ceil(
      (today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
    );
    const remaining = Math.max(0, total - elapsed);
    return remaining > 0 ? `${remaining}일 남음` : "완료";
  }

  function renderRecord(item: Medication, isActive: boolean) {
    return (
      <View
        key={item.id}
        style={[styles.recordCard, !isActive && styles.recordCardCompleted]}
      >
        <View style={styles.recordLeft}>
          <View style={styles.recordHeader}>
            <Text style={styles.medicationName}>{item.name}</Text>
            <View
              style={[
                styles.statusBadge,
                isActive ? styles.statusActive : styles.statusCompleted,
              ]}
            >
              <Text style={styles.statusText}>
                {isActive ? "진행 중" : "완료"}
              </Text>
            </View>
          </View>
          {item.dosage && (
            <Text style={styles.dosage}>용량: {item.dosage}</Text>
          )}
          <Text style={styles.recordDate}>
            {item.startDate} {item.endDate ? `~ ${item.endDate}` : "~"}
          </Text>
          {item.endDate && (
            <Text
              style={[
                styles.progress,
                isActive ? styles.progressActive : styles.progressCompleted,
              ]}
            >
              {getProgress(item.startDate, item.endDate)}
            </Text>
          )}
          {item.memo && <Text style={styles.recordMemo}>{item.memo}</Text>}
        </View>
        <Pressable onPress={() => handleDelete(item.id)}>
          <Text style={styles.deleteButton}>🗑️</Text>
        </Pressable>
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
        <Text style={styles.title}>💊 투약</Text>
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
            <Text style={styles.formTitle}>투약 추가</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="약 이름"
            />
            <TextInput
              style={styles.input}
              value={dosage}
              onChangeText={setDosage}
              placeholder="용량 (예: 1정, 0.5ml)"
            />
            <TextInput
              style={styles.input}
              value={startDate}
              onChangeText={setStartDate}
              placeholder="시작일 (예: 2024-01-15)"
            />
            <TextInput
              style={styles.input}
              value={endDate}
              onChangeText={setEndDate}
              placeholder="종료일 (선택)"
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

        {/* 진행 중 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            💊 진행 중 ({activeMedications.length})
          </Text>
          {activeMedications.length === 0 ? (
            <Text style={styles.emptyText}>진행 중인 투약이 없어요</Text>
          ) : (
            activeMedications.map((item) => renderRecord(item, true))
          )}
        </View>

        {/* 완료 */}
        {completedMedications.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              ✅ 완료 ({completedMedications.length})
            </Text>
            {completedMedications.map((item) => renderRecord(item, false))}
          </View>
        )}
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
  section: { paddingHorizontal: 16, marginBottom: 24 },
  sectionTitle: {
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
    alignItems: "flex-start",
    shadowColor: colors.cardShadow,
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  recordCardCompleted: { opacity: 0.6 },
  recordLeft: { flex: 1 },
  recordHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  medicationName: { fontSize: 16, fontWeight: "bold", color: colors.text },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  statusActive: { backgroundColor: "#FF6B6B20" },
  statusCompleted: { backgroundColor: "#34C75920" },
  statusText: { fontSize: 12, fontWeight: "bold" },
  dosage: { fontSize: 13, color: "#555", marginBottom: 2 },
  recordDate: { fontSize: 13, color: colors.subText },
  progress: { fontSize: 13, fontWeight: "bold", marginTop: 4 },
  progressActive: { color: colors.warning },
  progressCompleted: { color: colors.success },
  recordMemo: { fontSize: 13, color: "#555", marginTop: 4 },
  deleteButton: { fontSize: 20, paddingLeft: 8 },
  emptyText: {
    fontSize: 14,
    color: colors.subText,
    textAlign: "center",
    paddingVertical: 16,
  },
});
