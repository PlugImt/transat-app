import { Redirect, Stack } from "expo-router";
import { useAuth } from "@/hooks/account/useAuth";
import { screenOptions } from "@/navigation/navigationConfig";

export default function AppLayout() {
  const { user } = useAuth();

  if (user === undefined) {
    return null;
  }

  if (!user) {
    return <Redirect href="/(auth)/Welcome" />;
  }

  return <Stack screenOptions={screenOptions} />;
}
