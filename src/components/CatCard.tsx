import { View, Text, StyleSheet, Pressable } from "react-native";
import { colors } from "../styles/common";
import { useRouter } from "expo-router";

type Props = {
  name: string;
  breed: string;
  ageMonth: number;
};

export default function CatCard({ name, breed, ageMonth }: Props) {
  const router = useRouter();
  return (
    <Pressable
      style={styles.card}
      // Android: navigate("detail", args) 역할
      onPress={() =>
        router.push({
          pathname: "/detail",
          params: { name, breed, ageMonth },
        })
      }
    >
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.info}>{breed}</Text>
      <Text style={styles.info}>{ageMonth}개월</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: colors.cardShadow,
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 4,
  },
  info: {
    fontSize: 14,
    color: colors.subText,
  },
});
