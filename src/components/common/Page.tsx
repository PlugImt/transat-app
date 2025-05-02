import { cn } from "@/lib/utils";
import { useNavigation } from "@react-navigation/native";
import { ArrowLeft } from "lucide-react-native";
import { type ReactNode, useState } from "react";
import { useRef } from "react";
import { Dimensions, RefreshControl, ScrollView, View } from "react-native";
import ConfettiCannon from "react-native-confetti-cannon";
import { useTheme } from "@/themes/useThemeProvider";

type PageProps = {
  children: ReactNode;
  refreshing?: boolean;
  onRefresh?: () => void;
  className?: string;
  goBack?: boolean;
  footer?: ReactNode;
  confetti?: boolean;
  onConfettiTrigger?: (trigger: () => void) => void;
};

export default function Page({
  children,
  refreshing = false,
  onRefresh,
  className,
  goBack,
  footer,
  confetti = false,
  onConfettiTrigger,
}: PageProps) {
  const navigation = useNavigation();
  const theme = useTheme();
  const confettiRef = useRef<ConfettiCannon>(null);
  const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
  const [confettiTriggered, setConfettiTriggered] = useState(false);

  // Expose the confetti trigger function to parent components
  if (onConfettiTrigger) {
    onConfettiTrigger(() => {
      if (confettiRef.current) {
        setConfettiTriggered(true);
        confettiRef.current.start();
      }
    });
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <ScrollView
        style={{ flex: 1, backgroundColor: theme.background }}
        automaticallyAdjustKeyboardInsets
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.primary]}
            progressBackgroundColor={theme.background}
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
            <ArrowLeft color={theme.foreground} onPress={() => navigation.goBack()} />
          )}
          {children}
        </View>
      </ScrollView>
      {footer && <View className="bg-background px-5 py-4">{footer}</View>}

      {confetti && (
        <View style={{ zIndex: confettiTriggered ? 50 : -10 }}>
          <ConfettiCannon
            ref={confettiRef}
            count={200}
            origin={{ x: screenWidth / 2, y: screenHeight - 200 }}
            autoStart={false}
            fadeOut={false}
            colors={[theme.primary, theme.secondary, theme.foreground]}
            explosionSpeed={400}
            fallSpeed={4000}
            autoStartDelay={-1}
          />
        </View>
      )}
    </View>
  );
}
