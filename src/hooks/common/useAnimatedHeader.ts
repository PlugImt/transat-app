import React, { createContext, useContext } from "react";
import {
  type SharedValue,
  useAnimatedScrollHandler,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

export const useAnimatedHeader = () => {
  const scrollY = useSharedValue(0);
  const lastScrollY = useSharedValue(0);
  const headerShown = useSharedValue(1);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      const currentScrollY = event.contentOffset.y;

      // Only process scroll if we're not in the bounce area (y >= 0)
      if (currentScrollY >= 0) {
        const dy = currentScrollY - lastScrollY.value;

        // Detect if we're actively scrolling or if it's bounce movement
        if (Math.abs(dy) > 0.5) {
          // Using a smaller divisor for more responsive movement
          const newValue = headerShown.value + -dy / 50;

          // Clamp the value with better boundary handling
          headerShown.value = withSpring(Math.min(Math.max(newValue, 0), 1), {
            damping: 15,
            stiffness: 200,
          });
        }
      } else {
        // If we're in the bounce area (negative scroll), keep header visible
        if (headerShown.value < 1) {
          headerShown.value = withSpring(1, {
            damping: 15,
            stiffness: 200,
          });
        }
      }

      lastScrollY.value = currentScrollY;
      scrollY.value = currentScrollY;
    },
  });

  return {
    headerShown,
    scrollHandler,
    scrollY,
  };
};

type AnimatedHeaderCtx = {
  headerShown: SharedValue<number>;
  scrollY: SharedValue<number>;
} | null;

export const AnimatedHeaderContext = createContext<AnimatedHeaderCtx>(null);

export const useAnimatedHeaderContext = () => {
  return useContext(AnimatedHeaderContext);
};
