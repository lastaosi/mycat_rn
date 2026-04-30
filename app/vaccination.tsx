import { useLocalSearchParams } from "expo-router";
import VaccinationScreen from "../src/screens/VaccinationScreen";

export default function Vaccination() {
  const { catId } = useLocalSearchParams<{ catId: string }>();
  return <VaccinationScreen catId={Number(catId)} />;
}
