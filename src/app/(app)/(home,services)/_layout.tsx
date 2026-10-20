import { Stack } from "expo-router/stack";
import { useTheme } from "@/contexts/ThemeContext";

export const unstable_settings = {
  home: { anchor: "index" },
  services: { anchor: "services" },
};

export default function HomeServicesLayout() {
  const { theme } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.background },
      }}
    />
  );
}
