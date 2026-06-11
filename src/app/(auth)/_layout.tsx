import { Stack } from "expo-router";
import { screenOptions } from "@/navigation/navigationConfig";

export default function AuthLayout() {
  return <Stack screenOptions={screenOptions} />;
}
