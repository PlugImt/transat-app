import { Stack } from "expo-router/stack";
import { TabContentInsets } from "@/components/navigation/TabContentInsets";
import { useTheme } from "@/contexts/ThemeContext";

export default function PhotosLayout() {
  const { theme } = useTheme();

  return (
    <TabContentInsets>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.background },
        }}
      />
    </TabContentInsets>
  );
}
