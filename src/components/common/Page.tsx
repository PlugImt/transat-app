import type { ReactNode } from "react";
import { RefreshControl, ScrollView, View } from "react-native";

type PageProps = {
  children: ReactNode;
  refreshing?: boolean;
  onRefresh?: () => void;
};

export default function Page({
  children,
  refreshing = false,
  onRefresh,
}: PageProps) {
  return (
    <ScrollView
      className="bg-background"
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={["#ec7f32"]}
          progressBackgroundColor="#0D0505"
        />
      }
    >
      <View className="container pb-12">{children}</View>
    </ScrollView>
  );
}
