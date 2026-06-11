import { Stack } from "expo-router";
import { screenOptions } from "@/navigation/navigationConfig";

export default function GamesTabLayout() {
  return <Stack screenOptions={screenOptions} />;
}
