import { useLocalSearchParams } from "expo-router";
import DiaryScreen from "../src/screens/DiaryScreen";

export default function Diary() {
  const { catId } = useLocalSearchParams<{ catId: string }>();
  return <DiaryScreen catId={Number(catId)} />;
}
