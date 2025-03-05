import { theme } from "@/themes";
import { ActivityIndicator, View } from "react-native";

export default function LoadingScreen() {
  return (
    <View className="bg-background px-5 justify-center items-center gap-2 h-screen">
      <ActivityIndicator size="large" color={theme.primary} />
    </View>
  );
}
