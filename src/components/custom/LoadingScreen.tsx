import { useTheme } from "@/themes/useThemeProvider";
import { ActivityIndicator, View } from "react-native";

export default function LoadingScreen() {
  const theme = useTheme();
  return (
    <View className="bg-background px-5 justify-center items-center gap-2 h-screen">
      <ActivityIndicator size="large" color={theme.primary} />
    </View>
  );
}
