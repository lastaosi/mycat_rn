import { View, Text, FlatList, ActivityIndicator } from "react-native";
import { commonStyles, colors } from "../styles/common";
import CatCard from "../components/CatCard";
import { useCatList } from "../hooks/useCats";

const dummyCats = [
  { id: "1", name: "별이", breed: "코리안 숏헤어", ageMonth: 24 },
  { id: "2", name: "달이", breed: "러시안 블루", ageMonth: 36 },
  { id: "3", name: "해피", breed: "스코티시 폴드", ageMonth: 18 },
];

export default function HomeScreen() {
  const { cats, isLoading } = useCatList();
  if (isLoading) {
    return (
      <View
        style={[
          commonStyles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={commonStyles.container}>
      <Text style={commonStyles.title}>내 고양이</Text>
      <FlatList
        data={cats}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CatCard
            name={item.name}
            breed={item.breed}
            ageMonth={item.ageMonth}
          />
        )}
      ></FlatList>
    </View>
  );
}
