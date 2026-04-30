import { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { getCatCount } from "../src/database/catRepository";

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    async function checkAndNavigate() {
      try {
        const count = await getCatCount();
        setTimeout(() => {
          if (count > 0) {
            router.replace("/main");
          } else {
            router.replace("/register");
          }
        }, 1500);
      } catch (e) {
        console.error("DB 초기화 에러 : ", e);
        router.replace("/main");
      }
    }
    checkAndNavigate();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>🐱</Text>
      <Text style={styles.title}>MyCat</Text>
      <Text style={styles.subtitle}>별이의 건강 다이어리</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FF6B6B",
  },
  emoji: { fontSize: 64, marginBottom: 16 },
  title: { fontSize: 32, fontWeight: "bold", color: "#fff", marginBottom: 8 },
  subtitle: { fontSize: 16, color: "#fff", opacity: 0.8 },
});
