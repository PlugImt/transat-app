import { cn } from "@/lib/utils";
import { useNavigation } from "@react-navigation/native";
import { ArrowLeft } from "lucide-react-native";
import type { ReactNode } from "react";
import { useRef } from "react";
import { Dimensions, RefreshControl, ScrollView, View } from "react-native";
import ConfettiCannon from "react-native-confetti-cannon";

type PageProps = {
  children: ReactNode;
  refreshing?: boolean;
  onRefresh?: () => void;
  className?: string;
  goBack?: boolean;
  footer?: ReactNode;
  onConfettiTrigger?: (trigger: () => void) => void;
};

export default function Page({
  children,
  refreshing = false,
  onRefresh,
  className,
  goBack,
  footer,
  onConfettiTrigger,
}: PageProps) {
  const navigation = useNavigation();
  const confettiRef = useRef<ConfettiCannon>(null);
  const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

  // Expose the confetti trigger function to parent components
  if (onConfettiTrigger) {
    onConfettiTrigger(() => {
      if (confettiRef.current) {
        confettiRef.current.start();
      }
    });
  }

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        className="flex-1 bg-background"
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
        <View
          className={cn(
            "bg-background px-5 pt-8 flex flex-col gap-2 pb-12",
            className,
          )}
        >
          {goBack && (
            <ArrowLeft color="white" onPress={() => navigation.goBack()} />
          )}
          {children}
        </View>
      </ScrollView>
      {footer && <View className="bg-background px-5 py-4">{footer}</View>}

      <ConfettiCannon
        ref={confettiRef}
        count={100}
        origin={{ x: screenWidth / 2, y: screenHeight - 200 }}
        autoStart={false}
        fadeOut={false}
        colors={["#ec7f32", "#0049a8", "#ffe6cc"]}
        explosionSpeed={200}
        fallSpeed={3000}
        autoStartDelay={0}
      />
    </View>
  );
}
