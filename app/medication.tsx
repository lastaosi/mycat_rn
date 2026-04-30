import { useLocalSearchParams } from "expo-router";
import MedicationScreen from "../src/screens/MedicationScreen";

export default function Medication() {
  const { catId } = useLocalSearchParams<{ catId: string }>();
  return <MedicationScreen catId={Number(catId)} />;
}
