import { LinearGradient } from "expo-linear-gradient";
import { MotiView } from "moti";
import type React from "react";
import { useRef, useState } from "react";
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
  // Hidden until both sizes are known: content that fits shows no fade, whatever order the events arrive in.
  const [showBottomIndicator, setShowBottomIndicator] = useState(false);
  const metrics = useRef({ scrollY: 0, viewHeight: 0, contentHeight: 0 });

  const updateBottom = () => {
    const { scrollY, viewHeight, contentHeight } = metrics.current;
    if (viewHeight === 0 || contentHeight === 0) return;
    setShowBottomIndicator(scrollY + viewHeight < contentHeight - 5);
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, layoutMeasurement, contentSize } = event.nativeEvent;
    metrics.current = {
      scrollY: contentOffset.y,
      viewHeight: layoutMeasurement.height,
      contentHeight: contentSize.height,
    };
    setShowTopIndicator(contentOffset.y > 5);
    updateBottom();

    scrollViewProps.onScroll?.(event);
  };

  const handleContentSizeChange = (
    contentWidth: number,
    contentHeight: number,
  ) => {
    metrics.current.contentHeight = contentHeight;
    updateBottom();

    scrollViewProps.onContentSizeChange?.(contentWidth, contentHeight);
  };

  const handleScrollViewLayout = (event: LayoutChangeEvent) => {
    metrics.current.viewHeight = event.nativeEvent.layout.height;
    updateBottom();

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
