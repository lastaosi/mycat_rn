import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { colors } from "../styles/common";
import { useWeight } from "../hooks/useWeight";
import WeightChartTab from "../components/weight/WeightChartTab";
import BreedAverageTab from "../components/weight/BreedAverageTab";

type Props = {
  catId: number;
};

type Tab = "my" | "breed";

export default function WeightScreen({ catId }: Props) {
  const router = useRouter();
  const { records, isLoading, addWeight, removeWeight } = useWeight(catId);
  const [activeTab, setActiveTab] = useState<Tab>("my");

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
        <Text style={styles.title}>⚖️ 체중 관리</Text>
      </View>

      {/* 탭 */}
      <View style={styles.tabBar}>
        <Pressable
          style={[styles.tab, activeTab === "my" && styles.tabActive]}
          onPress={() => setActiveTab("my")}
        >
          <Text
            style={[styles.tabText, activeTab === "my" && styles.tabTextActive]}
          >
            내 고양이 추이
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tab, activeTab === "breed" && styles.tabActive]}
          onPress={() => setActiveTab("breed")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "breed" && styles.tabTextActive,
            ]}
          >
            품종 평균 성장
          </Text>
        </Pressable>
      </View>

      {/* 탭 컨텐츠 */}
      {activeTab === "my" ? (
        <WeightChartTab
          records={records}
          onAdd={addWeight}
          onDelete={removeWeight}
        />
      ) : (
        <BreedAverageTab catId={catId} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 60,
    marginBottom: 16,
    paddingHorizontal: 16,
    gap: 16,
  },
  backButton: { fontSize: 16, color: colors.primary },
  title: { fontSize: 20, fontWeight: "bold" },
  tabBar: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.white,
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: "center",
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  tabText: { fontSize: 14, color: colors.subText },
  tabTextActive: { color: colors.primary, fontWeight: "bold" },
});
