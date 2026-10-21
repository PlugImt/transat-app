import { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/utils/class.utils";

type ProgressBarProps = {
  /** 0 to 1. */
  value: number;
  className?: string;
};

export const ProgressBar = ({ value, className }: ProgressBarProps) => {
  const { theme } = useTheme();
  const clamped = Math.min(1, Math.max(0, value));
  const progress = useSharedValue(clamped);

  useEffect(() => {
    progress.value = withTiming(clamped, { duration: 200 });
  }, [clamped, progress]);

  const fill = useAnimatedStyle(() => ({ width: `${progress.value * 100}%` }));

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: Math.round(clamped * 100) }}
      className={cn("h-1.5 overflow-hidden rounded-full", className)}
      style={{ backgroundColor: theme.border }}
    >
      <Animated.View
        style={[{ height: "100%", backgroundColor: theme.primary }, fill]}
      />
    </View>
  );
};
