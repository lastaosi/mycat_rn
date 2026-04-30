import { useLocalSearchParams } from "expo-router";
import WeightScreen from "../src/screens/WeightScreen";

export default function Weight() {
  const { catId } = useLocalSearchParams<{ catId: string }>();
  return <WeightScreen catId={Number(catId)} />;
}
