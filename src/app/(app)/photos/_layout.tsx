import { Stack } from "expo-router/stack";
import { useTheme } from "@/contexts/ThemeContext";

export default function PhotosLayout() {
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
