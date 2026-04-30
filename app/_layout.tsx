import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="main" />
      <Stack.Screen name="weight" />
      <Stack.Screen name="vaccination" />
      <Stack.Screen name="medication" />
      <Stack.Screen name="diary" />
      <Stack.Screen name="healthcheck" />
      <Stack.Screen name="nearbyvet" />
      <Stack.Screen name="careguide" />
      <Stack.Screen name="register" />
      <Stack.Screen name="deviceinfo" />
    </Stack>
  );
}
