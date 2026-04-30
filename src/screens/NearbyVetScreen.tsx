import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Alert,
  Linking,
  Platform,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { colors } from "../styles/common";

type Vet = {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  rating?: number;
};

type Region = {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
};

export default function NearbyVetScreen() {
  const router = useRouter();
  const [region, setRegion] = useState<Region | null>(null);
  const [vets, setVets] = useState<Vet[]>([]);
  const [selectedVet, setSelectedVet] = useState<Vet | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  async function getCurrentLocation() {
    setIsLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("알림", "위치 권한이 필요해요");
        setIsLoading(false);
        return;
      }
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      setRegion({
        latitude,
        longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      });

      await searchNearbyVets(latitude, longitude);
    } catch (e) {
      console.error("위치 에러:", e);
      Alert.alert("오류", "위치를 가져올 수 없어요");
    } finally {
      setIsLoading(false);
    }
  }

  async function searchNearbyVets(latitude: number, longitude: number) {
    try {
      const apiKey = "GOOGLE_MAP_KEY"; // ← 여기에 API 키 입력
      const radius = 2000;
      const type = "veterinary_care";
      const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&type=${type}&language=ko&key=${apiKey}`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.results) {
        const vetList: Vet[] = data.results.map((place: any) => ({
          id: place.place_id,
          name: place.name,
          address: place.vicinity,
          latitude: place.geometry.location.lat,
          longitude: place.geometry.location.lng,
          rating: place.rating,
        }));
        setVets(vetList);
      }
    } catch (e) {
      console.error("장소 검색 에러:", e);
    }
  }

  function handleVetPress(vet: Vet) {
    setSelectedVet(vet);
  }

  function handleNavigate(vet: Vet) {
    const scheme = Platform.OS === "ios" ? "maps:" : "geo:";
    const url =
      Platform.OS === "ios"
        ? `maps://?q=${vet.name}&ll=${vet.latitude},${vet.longitude}`
        : `geo:${vet.latitude},${vet.longitude}?q=${vet.name}`;
    Linking.openURL(url);
  }

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B6B" />
        <Text style={styles.loadingText}>주변 동물병원 검색 중...</Text>
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
        <Text style={styles.title}>🏥 근처 동물병원</Text>
        <Pressable onPress={getCurrentLocation}>
          <Text style={styles.refreshButton}>새로고침</Text>
        </Pressable>
      </View>

      {/* 지도 */}
      {region && (
        <MapView
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={region}
          showsUserLocation
          showsMyLocationButton
        >
          {/* 동물병원 마커 */}
          {vets.map((vet) => (
            <Marker
              key={vet.id}
              coordinate={{ latitude: vet.latitude, longitude: vet.longitude }}
              title={vet.name}
              description={vet.address}
              pinColor="#FF6B6B"
              onPress={() => handleVetPress(vet)}
            />
          ))}
        </MapView>
      )}

      {/* 선택된 동물병원 정보 */}
      {selectedVet && (
        <View style={styles.vetCard}>
          <View style={styles.vetInfo}>
            <Text style={styles.vetName}>{selectedVet.name}</Text>
            <Text style={styles.vetAddress}>{selectedVet.address}</Text>
            {selectedVet.rating && (
              <Text style={styles.vetRating}>⭐ {selectedVet.rating}</Text>
            )}
          </View>
          <Pressable
            style={styles.navigateButton}
            onPress={() => handleNavigate(selectedVet)}
          >
            <Text style={styles.navigateButtonText}>길찾기</Text>
          </Pressable>
        </View>
      )}

      {/* 검색 결과 없음 */}
      {vets.length === 0 && !isLoading && (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>주변 동물병원이 없어요</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  loadingText: { fontSize: 14, color: colors.subText },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 60,
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  backButton: { fontSize: 16, color: colors.primary },
  title: { fontSize: 20, fontWeight: "bold" },
  refreshButton: { fontSize: 16, color: colors.primary },
  map: { flex: 1 },
  vetCard: {
    backgroundColor: colors.white,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: colors.cardShadow,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  vetInfo: { flex: 1 },
  vetName: { fontSize: 16, fontWeight: "bold", color: colors.text, marginBottom: 4 },
  vetAddress: { fontSize: 13, color: colors.subText, marginBottom: 2 },
  vetRating: { fontSize: 13, color: colors.warning },
  navigateButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginLeft: 12,
  },
  navigateButtonText: { color: colors.white, fontWeight: "bold", fontSize: 14 },
  emptyContainer: {
    position: "absolute",
    bottom: 32,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  emptyText: { fontSize: 14, color: colors.subText },
});
