import { LinearGradient } from "expo-linear-gradient";
import { MotiView } from "moti";
import type React from "react";
import { useState } from "react";
import {
  type LayoutChangeEvent,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  ScrollView,
  type ScrollViewProps,
  View,
} from "react-native";
import { useTheme } from "@/contexts/ThemeContext";

interface ScrollViewWithIndicatorsProps extends ScrollViewProps {
  children: React.ReactNode;
  className?: string;
  maxHeight?: number;
  scrollable?: boolean;
  indicatorHeight?: {
    top?: number;
    bottom?: number;
  };
  gradientHeight?: {
    top?: number;
    bottom?: number;
  };
}

const ScrollViewWithIndicators = ({
  children,
  className,
  maxHeight = 400,
  scrollable,
  indicatorHeight = { top: 50, bottom: 150 },
  gradientHeight = { top: 50, bottom: 150 },
  ...scrollViewProps
}: ScrollViewWithIndicatorsProps) => {
  const { theme } = useTheme();
  const [showTopIndicator, setShowTopIndicator] = useState(false);
  const [showBottomIndicator, setShowBottomIndicator] = useState(true);
  const [scrollViewHeight, setScrollViewHeight] = useState(0);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, layoutMeasurement, contentSize } = event.nativeEvent;
    const scrollY = contentOffset.y;
    const scrollViewHeight = layoutMeasurement.height;
    const contentHeight = contentSize.height;

    setShowTopIndicator(scrollY > 5);
    setShowBottomIndicator(scrollY + scrollViewHeight < contentHeight - 5);

    scrollViewProps.onScroll?.(event);
  };

  const handleContentSizeChange = (
    contentWidth: number,
    contentHeight: number,
  ) => {
    if (scrollViewHeight > 0) {
      setShowBottomIndicator(contentHeight > scrollViewHeight);
    }

    scrollViewProps.onContentSizeChange?.(contentWidth, contentHeight);
  };

  const handleScrollViewLayout = (event: LayoutChangeEvent) => {
    setScrollViewHeight(event.nativeEvent.layout.height);

    scrollViewProps.onLayout?.(event);
  };

  const getContent = () => {
    if (!scrollable) {
      return (
        <View
          className={className}
          style={[{ maxHeight }, scrollViewProps.style]}
        >
          {children}
        </View>
      );
    }

    return (
      <ScrollView
        {...scrollViewProps}
        onScroll={handleScroll}
        onContentSizeChange={handleContentSizeChange}
        onLayout={handleScrollViewLayout}
        scrollEventThrottle={scrollViewProps.scrollEventThrottle ?? 16}
        style={[{ maxHeight }, scrollViewProps.style]}
      >
        <View className={className}>{children}</View>
      </ScrollView>
    );
  };

  return (
    <View className="relative">
      {getContent()}

      {scrollable && (
        <>
          <MotiView
            animate={{
              opacity: showTopIndicator ? 1 : 0,
            }}
            transition={{
              type: "spring",
            }}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: indicatorHeight.top,
              zIndex: 10,
              pointerEvents: "none",
            }}
          >
            <LinearGradient
              colors={[theme.card, `${theme.card}00`]}
              locations={[0, 1]}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: gradientHeight.top,
                zIndex: 10,
                pointerEvents: "none",
              }}
            />
          </MotiView>

          <MotiView
            animate={{
              opacity: showBottomIndicator ? 1 : 0,
            }}
            transition={{
              type: "spring",
            }}
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: indicatorHeight.bottom,
              zIndex: 10,
              pointerEvents: "none",
            }}
          >
            <LinearGradient
              colors={[`${theme.card}00`, theme.card]}
              locations={[0, 1]}
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: gradientHeight.bottom,
                zIndex: 10,
                pointerEvents: "none",
              }}
            />
          </MotiView>
        </>
      )}
    </View>
  );
};

export default ScrollViewWithIndicators;
