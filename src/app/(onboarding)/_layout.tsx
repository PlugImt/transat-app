import { Stack } from "expo-router/stack";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/contexts/ThemeContext";

export const unstable_settings = {
  anchor: "start",
};

export default function OnboardingLayout() {
  const { theme } = useTheme();

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.background }}
      edges={["top", "bottom", "left", "right"]}
    >
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
          contentStyle: { backgroundColor: theme.background },
        }}
      />
    </SafeAreaView>
  );
}
