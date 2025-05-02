import type React from "react";
import { useEffect } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withDelay,
  Easing,
} from "react-native-reanimated";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

interface FloatingElementsProps {
  count?: number;
}

const ELEMENTS_COLORS = ["#ec7f32", "#0049a8", "#ffe6cc"];

const FloatingElements: React.FC<FloatingElementsProps> = ({ count = 12 }) => {
  const elements = Array(count)
    .fill(0)
    .map((_, index) => {
      // Distribute elements across the entire screen initially
      const x = useSharedValue(Math.random() * SCREEN_WIDTH);
      const y = useSharedValue(Math.random() * SCREEN_HEIGHT);
      const size = useSharedValue(10 + Math.random() * 20);
      const opacity = useSharedValue(0.1 + Math.random() * 0.4);

      useEffect(() => {
        const animate = () => {
          const randomDuration = 3000 + Math.random() * 5000;

          // Generate random positions across the entire screen
          const randomX = Math.random() * SCREEN_WIDTH;
          const randomY = Math.random() * SCREEN_HEIGHT;

          x.value = withDelay(
            index * 200,
            withRepeat(
              withTiming(randomX, {
                duration: randomDuration,
                easing: Easing.inOut(Easing.ease),
              }),
              -1,
              true,
            ),
          );

          y.value = withDelay(
            index * 200,
            withRepeat(
              withTiming(randomY, {
                duration: randomDuration * 1.3,
                easing: Easing.inOut(Easing.ease),
              }),
              -1,
              true,
            ),
          );

          opacity.value = withDelay(
            index * 200,
            withRepeat(
              withTiming(0.1 + Math.random() * 0.4, {
                duration: randomDuration,
                easing: Easing.inOut(Easing.ease),
              }),
              -1,
              true,
            ),
          );
        };

        animate();

        // Clean up animations when component unmounts
        return () => {};
      }, []);

      const animatedStyle = useAnimatedStyle(() => {
        return {
          position: "absolute",
          width: size.value,
          height: size.value,
          borderRadius: size.value / 2,
          backgroundColor: ELEMENTS_COLORS[index % ELEMENTS_COLORS.length],
          opacity: opacity.value,
          transform: [{ translateX: x.value }, { translateY: y.value }],
        };
      });

      return <Animated.View key={index} style={animatedStyle} />;
    });

  return (
    <View style={styles.container} pointerEvents="none">
      {elements}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
});

export default FloatingElements;
