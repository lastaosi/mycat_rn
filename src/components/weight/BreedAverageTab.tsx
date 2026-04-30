import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import {
  VictoryChart,
  VictoryLine,
  VictoryAxis,
  VictoryTheme,
} from "victory-native";
import { useEffect, useState } from "react";
import { getCatById } from "../../database/catRepository";
import { colors } from "../../styles/common";

type Props = {
  catId: number;
};

// 품종 평균 더미 데이터 — 나중에 DB 연동
const breedAverageData = [
  { x: 1, y: 0.1 },
  { x: 2, y: 0.3 },
  { x: 3, y: 0.6 },
  { x: 6, y: 1.5 },
  { x: 9, y: 2.5 },
  { x: 12, y: 3.5 },
  { x: 18, y: 4.0 },
  { x: 24, y: 4.5 },
];

export default function BreedAverageTab({ catId }: Props) {
  const [breedName, setBreedName] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadBreed() {
      try {
        const cat = await getCatById(catId);
        setBreedName(cat?.breedNameCustom ?? "알 수 없음");
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
    loadBreed();
  }, [catId]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B6B" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>품종 평균 성장 추이</Text>
        <Text style={styles.breedName}>{breedName}</Text>
        <VictoryChart
          theme={VictoryTheme.material}
          height={220}
          padding={{ top: 20, bottom: 40, left: 50, right: 20 }}
        >
          <VictoryAxis
            tickFormat={(t) => `${t}개월`}
            style={{ tickLabels: { fontSize: 10, fill: "#888" } }}
          />
          <VictoryAxis
            dependentAxis
            tickFormat={(t) => `${t}kg`}
            style={{ tickLabels: { fontSize: 10, fill: "#888" } }}
          />
          <VictoryLine
            data={breedAverageData}
            style={{ data: { stroke: "#4A90E2", strokeWidth: 2 } }}
          />
        </VictoryChart>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>📊 품종 평균 정보</Text>
        <Text style={styles.infoText}>
          품종별 평균 성장 데이터를 기반으로 표시돼요. 실제 데이터는 DB 연동 후
          업데이트될 예정이에요.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  chartCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: colors.cardShadow,
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 4,
  },
  breedName: { fontSize: 13, color: colors.subText, marginBottom: 8 },
  infoCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    shadowColor: colors.cardShadow,
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 8,
  },
  infoText: { fontSize: 13, color: "#666", lineHeight: 20 },
});
