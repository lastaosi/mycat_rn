import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { colors } from "../styles/common";

type CheckItem = {
  id: string;
  category: string;
  title: string;
  description: string;
  checked: boolean;
};

const initialCheckList: CheckItem[] = [
  // 식욕/음수
  {
    id: "1",
    category: "식욕/음수",
    title: "식욕이 정상인가요?",
    description: "평소와 비슷한 양을 먹고 있나요?",
    checked: false,
  },
  {
    id: "2",
    category: "식욕/음수",
    title: "물을 충분히 마시나요?",
    description: "하루 적정 음수량을 마시고 있나요?",
    checked: false,
  },
  // 배변
  {
    id: "3",
    category: "배변",
    title: "대변이 정상인가요?",
    description: "색깔, 형태, 냄새가 정상인가요?",
    checked: false,
  },
  {
    id: "4",
    category: "배변",
    title: "소변이 정상인가요?",
    description: "색깔, 양, 횟수가 정상인가요?",
    checked: false,
  },
  // 행동
  {
    id: "5",
    category: "행동",
    title: "활동량이 정상인가요?",
    description: "평소처럼 활발하게 움직이나요?",
    checked: false,
  },
  {
    id: "6",
    category: "행동",
    title: "그루밍을 잘 하나요?",
    description: "스스로 털을 정리하고 있나요?",
    checked: false,
  },
  // 외관
  {
    id: "7",
    category: "외관",
    title: "눈이 맑고 깨끗한가요?",
    description: "눈곱이나 충혈이 없나요?",
    checked: false,
  },
  {
    id: "8",
    category: "외관",
    title: "귀가 깨끗한가요?",
    description: "귀지나 냄새가 없나요?",
    checked: false,
  },
  {
    id: "9",
    category: "외관",
    title: "털 상태가 좋은가요?",
    description: "윤기 있고 탈모가 없나요?",
    checked: false,
  },
  // 체중
  {
    id: "10",
    category: "체중",
    title: "체중이 정상 범위인가요?",
    description: "급격한 체중 변화가 없나요?",
    checked: false,
  },
];

export default function HealthCheckScreen() {
  const router = useRouter();
  const [checkList, setCheckList] = useState<CheckItem[]>(initialCheckList);

  function toggleCheck(id: string) {
    setCheckList((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item,
      ),
    );
  }

  function handleReset() {
    Alert.alert("초기화", "체크 항목을 모두 초기화할까요?", [
      { text: "취소", style: "cancel" },
      {
        text: "초기화",
        onPress: () =>
          setCheckList(
            initialCheckList.map((item) => ({ ...item, checked: false })),
          ),
      },
    ]);
  }

  // 카테고리별 그루핑
  const categories = [...new Set(checkList.map((item) => item.category))];
  const checkedCount = checkList.filter((item) => item.checked).length;
  const totalCount = checkList.length;
  const progress = Math.round((checkedCount / totalCount) * 100);

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.backButton}>← 뒤로</Text>
        </Pressable>
        <Text style={styles.title}>🏥 건강 체크</Text>
        <Pressable onPress={handleReset}>
          <Text style={styles.resetButton}>초기화</Text>
        </Pressable>
      </View>

      {/* 진행률 */}
      <View style={styles.progressCard}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressTitle}>오늘의 건강 체크</Text>
          <Text style={styles.progressCount}>
            {checkedCount}/{totalCount}
          </Text>
        </View>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressPercent}>{progress}% 완료</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        {categories.map((category) => (
          <View key={category} style={styles.categorySection}>
            <Text style={styles.categoryTitle}>{category}</Text>
            {checkList
              .filter((item) => item.category === category)
              .map((item) => (
                <Pressable
                  key={item.id}
                  style={[
                    styles.checkCard,
                    item.checked && styles.checkCardChecked,
                  ]}
                  onPress={() => toggleCheck(item.id)}
                >
                  <View style={styles.checkLeft}>
                    <Text style={styles.checkTitle}>{item.title}</Text>
                    <Text style={styles.checkDescription}>
                      {item.description}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.checkbox,
                      item.checked && styles.checkboxChecked,
                    ]}
                  >
                    {item.checked && <Text style={styles.checkmark}>✓</Text>}
                  </View>
                </Pressable>
              ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
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
  resetButton: { fontSize: 16, color: colors.subText },
  progressCard: {
    backgroundColor: colors.white,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: colors.cardShadow,
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  progressTitle: { fontSize: 15, fontWeight: "bold", color: colors.text },
  progressCount: { fontSize: 15, color: colors.primary, fontWeight: "bold" },
  progressBar: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    marginBottom: 6,
  },
  progressFill: {
    height: "100%",
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  progressPercent: { fontSize: 13, color: colors.subText, textAlign: "right" },
  scrollView: { flex: 1 },
  categorySection: { marginBottom: 8 },
  categoryTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.subText,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  checkCard: {
    backgroundColor: colors.white,
    marginHorizontal: 16,
    marginBottom: 6,
    borderRadius: 12,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: colors.cardShadow,
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  checkCardChecked: { backgroundColor: "#FFF5F5" },
  checkLeft: { flex: 1 },
  checkTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 2,
  },
  checkDescription: { fontSize: 13, color: colors.subText },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 12,
  },
  checkboxChecked: { backgroundColor: colors.primary, borderColor: colors.primary },
  checkmark: { color: colors.white, fontSize: 14, fontWeight: "bold" },
});
