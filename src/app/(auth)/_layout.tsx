import { Stack } from "expo-router/stack";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/contexts/ThemeContext";

export const unstable_settings = {
  anchor: "welcome",
};

export default function AuthLayout() {
  const { theme } = useTheme();

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.background }}
      edges={["top", "bottom", "left", "right"]}
    >
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.background },
        }}
      />
    </SafeAreaView>
  );
}
