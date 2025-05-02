import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView, View } from "react-native";

export default function Layout() {
  return (
    <View className="flex-1 bg-background">
      <StatusBar style="light" translucent={true} backgroundColor="#070402C6" />
      <SafeAreaView className="flex-1 bg-background">
        <Slot />
      </SafeAreaView>
    </View>
  );
}
