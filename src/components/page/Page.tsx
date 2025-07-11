import React, { type ReactNode, useRef, useState } from "react";
import { Dimensions, RefreshControl, View } from "react-native";
import ConfettiCannon from "react-native-confetti-cannon";
import Animated from "react-native-reanimated";
import { useTheme } from "@/contexts/ThemeContext";
import { useAnimatedHeader } from "@/hooks/useAnimatedHeader";
import { cn } from "@/utils";
import { HEADER_HEIGHT, Header } from "./Header";

type PageProps = {
  children: ReactNode;
  refreshing?: boolean;
  onRefresh?: () => void;
  className?: string;
  goBack?: boolean;
  title?: string | ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  confetti?: boolean;
  onConfettiTrigger?: (trigger: () => void) => void;
  disableScroll?: boolean;
  asChildren?: boolean;
};

export const Page = ({
  children,
  refreshing = false,
  onRefresh,
  className,
  goBack,
  title,
  header,
  footer,
  confetti = false,
  onConfettiTrigger,
  disableScroll = false,
  asChildren = false,
}: PageProps) => {
  const { theme } = useTheme();
  const { scrollHandler, headerShown } = useAnimatedHeader();
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

  const contentWrapperProps = {
    onScroll: scrollHandler,
    refreshControl: onRefresh ? (
      <RefreshControl
        refreshing={refreshing}
        onRefresh={onRefresh}
        tintColor={theme.text}
        colors={[theme.primary]}
        progressViewOffset={HEADER_HEIGHT}
      />
    ) : undefined,
    contentContainerStyle: {
      paddingBottom: footer ? 0 : 40,
      paddingTop: HEADER_HEIGHT,
    },
    contentContainerClassName: "gap-4 pb-10 px-5",
  };

  const getContent = () => {
    if (asChildren) {
      return React.cloneElement(children as React.ReactElement, {
        ...contentWrapperProps,
      });
    }
    if (disableScroll) {
      return (
        <View
          className="pb-10 px-5 gap-4 flex-1"
          style={{ paddingTop: HEADER_HEIGHT }}
        >
          {children}
        </View>
      );
    }
    return (
      <Animated.ScrollView
        {...contentWrapperProps}
        className={cn(className, "flex-1")}
      >
        {children}
      </Animated.ScrollView>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <Header headerShown={headerShown} goBack={goBack} title={title}>
        {header}
      </Header>
      {getContent()}
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
};
