import { theme } from "@/themes";
import { ActivityIndicator, View } from "react-native";

export default function Loading() {
  return (
    <View className="min-h-screen flex justify-center items-center">
      <ActivityIndicator size="large" color={theme.primary} />
    </View>
  );
}
