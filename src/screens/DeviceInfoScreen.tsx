import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { colors } from "../styles/common";
import DeviceInfoModule from "../../modules/device-info-module";
import { DeviceInfo } from "../../modules/device-info-module/src/Device_info.types";

export default function DeviceInfoScreen() {
  const router = useRouter();
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDeviceInfo();
  }, []);

  async function loadDeviceInfo() {
    setIsLoading(true);
    try {
      // 네이티브 모듈 호출 — Android: Kotlin, iOS: Swift
      const info = await DeviceInfoModule.getDeviceInfo();
      setDeviceInfo(info);
    } catch (e) {
      console.error("디바이스 정보 에러:", e);
      setError("디바이스 정보를 가져올 수 없어요");
    } finally {
      setIsLoading(false);
    }
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
        <Text style={styles.title}>📱 디바이스 정보</Text>
        <Pressable onPress={loadDeviceInfo}>
          <Text style={styles.refreshButton}>새로고침</Text>
        </Pressable>
      </View>

      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : deviceInfo ? (
        <View style={styles.infoCard}>
          <Text style={styles.cardTitle}>네이티브 모듈에서 가져온 정보</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>기기명</Text>
            <Text style={styles.infoValue}>{deviceInfo.deviceName}</Text>
          </View>
          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>OS</Text>
            <Text style={styles.infoValue}>{deviceInfo.systemName}</Text>
          </View>
          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>OS 버전</Text>
            <Text style={styles.infoValue}>{deviceInfo.systemVersion}</Text>
          </View>
          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>앱 버전</Text>
            <Text style={styles.infoValue}>{deviceInfo.appVersion}</Text>
          </View>
          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>빌드 번호</Text>
            <Text style={styles.infoValue}>{deviceInfo.buildNumber}</Text>
          </View>
          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>시뮬레이터</Text>
            <Text style={styles.infoValue}>
              {deviceInfo.isSimulator ? "예" : "아니오"}
            </Text>
          </View>
        </View>
      ) : null}

      {/* 설명 */}
      <View style={styles.descCard}>
        <Text style={styles.descTitle}>📌 네이티브 모듈 구조</Text>
        <Text style={styles.descText}>
          Android → Kotlin (Device_infoModule.kt){"\n"}
          iOS → Swift (Device_infoModule.swift){"\n"}
          JS → TypeScript (Device_infoModule.ts){"\n\n"}
          KMP expect/actual 패턴과 동일한 개념이에요.{"\n"}
          플랫폼별 구현 → 공통 인터페이스로 호출
        </Text>
      </View>
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
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  backButton: { fontSize: 16, color: colors.primary },
  title: { fontSize: 20, fontWeight: "bold" },
  refreshButton: { fontSize: 16, color: colors.primary },
  errorContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: { fontSize: 16, color: colors.error },
  infoCard: {
    backgroundColor: colors.white,
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: colors.cardShadow,
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 14,
    color: colors.subText,
    marginBottom: 16,
    fontWeight: "bold",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  infoLabel: { fontSize: 15, color: "#555" },
  infoValue: { fontSize: 15, fontWeight: "bold", color: colors.text },
  divider: { height: 1, backgroundColor: "#f0f0f0" },
  descCard: {
    backgroundColor: colors.white,
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: colors.cardShadow,
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  descTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 8,
  },
  descText: { fontSize: 13, color: "#666", lineHeight: 22 },
});
