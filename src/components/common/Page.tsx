import { cn } from "@/lib/utils";
import type React from "react";
import type { ReactNode } from "react";
import { RefreshControl, ScrollView, View } from "react-native";

type PageProps = {
  children: ReactNode;
  refreshing?: boolean;
  onRefresh?: () => void;
  className?: string;
};

export default function Page({
  children,
  refreshing = false,
  onRefresh,
  className,
}: PageProps) {
  return (
    <ScrollView
      className="bg-background"
      automaticallyAdjustKeyboardInsets
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={["#ec7f32"]}
          progressBackgroundColor="#0D0505"
        />
      }
    >
      <View className={cn("bg-background px-5 pt-8 flex flex-col gap-2 pb-12", className)}>{children}</View>
    </ScrollView>
  );
}
