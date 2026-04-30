import { View, Text, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { commonStyles, colors } from "../styles/common";
import { Pressable } from "react-native";

export default function CatDetailScreen() {
  // Android: navArgs로 받던 것
  const { name, breed, ageMonth } = useLocalSearchParams<{
    name: string;
    breed: string;
    ageMonth: string;
  }>();

  // Android: navController.popBackStack() 역할
  const router = useRouter();

  return (
    <View style={commonStyles.container}>
      <Text style={commonStyles.title}>🐱 {name}</Text>
      <Text style={styles.info}>품종: {breed}</Text>
      <Text style={styles.info}>나이: {ageMonth}개월</Text>
      <Pressable style={styles.button} onPress={() => router.back()}>
        <Text style={styles.buttonText}>뒤로가기</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  info: {
    fontSize: 16,
    color: "#555",
    marginBottom: 8,
  },
  button: {
    marginTop: 24,
    backgroundColor: colors.primary,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: colors.white,
    fontWeight: "bold",
  },
});
