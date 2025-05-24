import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";
import { useNavigation } from "@react-navigation/native";
import { BlurView } from "expo-blur";
import { ArrowLeft } from "lucide-react-native";
import { type ReactNode, useRef, useState } from "react";
import {
  Dimensions,
  Platform,
  RefreshControl,
  ScrollView,
  StatusBar,
  Text,
  View,
} from "react-native";
import ConfettiCannon from "react-native-confetti-cannon";

type PageProps = {
  children: ReactNode;
  refreshing?: boolean;
  onRefresh?: () => void;
  className?: string;
  goBack?: boolean;
  title?: string;
  about?: ReactNode;
  newfName?: string;
  footer?: ReactNode;
  confetti?: boolean;
  onConfettiTrigger?: (trigger: () => void) => void;
  disableScroll?: boolean;
};

export default function Page({
  children,
  refreshing = false,
  onRefresh,
  className,
  goBack,
  title,
  about,
  newfName,
  footer,
  confetti = false,
  onConfettiTrigger,
  disableScroll = false,
}: PageProps) {
  const navigation = useNavigation();
  const { theme, actualTheme } = useTheme();
  const confettiRef = useRef<ConfettiCannon>(null);
  const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
  const [confettiTriggered, setConfettiTriggered] = useState(false);
  const statusBarHeight =
    Platform.OS === "ios" ? 0 : StatusBar.currentHeight || 0;

  // Expose the confetti trigger function to parent components
  if (onConfettiTrigger) {
    onConfettiTrigger(() => {
      if (confettiRef.current) {
        setConfettiTriggered(true);
        confettiRef.current.start();
      }
    });
  }

  const ContentWrapper = disableScroll ? View : ScrollView;
  const contentWrapperProps = disableScroll
    ? {
        style: {
          flex: 1,
          backgroundColor: theme.background,
          marginTop: statusBarHeight + 60,
          paddingHorizontal: 20,
          paddingBottom: 48,
        },
        className: cn("flex flex-col gap-2", className),
      }
    : {
        style: {
          flex: 1,
          backgroundColor: theme.background,
          marginTop: statusBarHeight + 60,
        },
        automaticallyAdjustKeyboardInsets: true,
        contentContainerStyle: { paddingTop: 10 },
        refreshControl: (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.primary]}
            progressBackgroundColor={theme.background}
          />
        ),
      };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      {/* Sticky Header */}
      <BlurView
        intensity={50}
        tint={actualTheme}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 10,
          paddingTop: statusBarHeight + 10,
          paddingBottom: 10,
          paddingHorizontal: 20,
          backgroundColor: theme.overlay, // Semi-transparent background with theme color
        }}
      >
        <View className="flex-row justify-between items-center">
          <View className="flex flex-row items-center justify-center">
            {goBack && (
              <ArrowLeft
                color={theme.text}
                onPress={() => navigation.goBack()}
              />
            )}
            {title && (
              <Text className="h1 ml-4" style={{ color: theme.text }}>
                {title}
                {newfName && (
                  <Text style={{ color: theme.primary }}> {newfName}</Text>
                )}
              </Text>
            )}
          </View>
          {about}
        </View>
      </BlurView>

      <ContentWrapper {...contentWrapperProps}>
        {disableScroll ? (
          children
        ) : (
          <View
            style={{
              backgroundColor: theme.background,
              paddingHorizontal: 20,
              paddingBottom: 48,
            }}
            className={cn("flex flex-col gap-2", className)}
          >
            {children}
          </View>
        )}
      </ContentWrapper>
      {footer && (
        <View
          style={{
            backgroundColor: theme.background,
            paddingHorizontal: 20,
            paddingVertical: 16,
          }}
        >
          {footer}
        </View>
      )}

      {confetti && (
        <View style={{ zIndex: confettiTriggered ? 50 : -10 }}>
          <ConfettiCannon
            ref={confettiRef}
            count={200}
            origin={{ x: screenWidth / 2, y: screenHeight - 200 }}
            autoStart={false}
            fadeOut={false}
            colors={[theme.primary, theme.secondary, theme.text]}
            explosionSpeed={400}
            fallSpeed={4000}
            autoStartDelay={-1}
          />
        </View>
      )}
    </View>
  );
}
