import { useTheme } from "@/contexts/ThemeContext";
import { type VariantProps, cva } from "class-variance-authority";
import { useEffect, useRef } from "react";
import { Animated, type View } from "react-native";

const skeletonVariants = cva("rounded-md overflow-hidden", {
  variants: {
    variant: {
      default: "",
      circle: "rounded-full",
      rounded: "rounded-lg",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export interface SkeletonProps
  extends VariantProps<typeof skeletonVariants>,
    React.ComponentPropsWithoutRef<typeof View> {
  width?: number | "auto" | `${number}%`;
  height?: number | "auto" | `${number}%`;
  animated?: boolean;
}

export function Skeleton({
  className,
  variant,
  width,
  height,
  animated = true,
  style,
  ...props
}: SkeletonProps) {
  const { theme } = useTheme();
  const opacity = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    if (animated) {
      const animation = Animated.loop(
        Animated.sequence([
          Animated.timing(opacity, {
            toValue: 0.8,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0.5,
            duration: 800,
            useNativeDriver: true,
          }),
        ]),
      );

      animation.start();

      return () => {
        animation.stop();
      };
    }
  }, [animated, opacity]);

  return (
    <Animated.View
      className={skeletonVariants({ variant, className })}
      style={[
        {
          width: width as number | "auto" | `${number}%` | undefined,
          height: height as number | "auto" | `${number}%` | undefined,
          opacity,
          backgroundColor: theme.muted,
        },
        style,
      ]}
      {...props}
    />
  );
}

export default Skeleton;
