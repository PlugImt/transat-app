import type React from "react";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  Easing,
  Extrapolate,
  interpolate,
} from "react-native-reanimated";

interface LogoAnimationProps {
  size?: number;
  onAnimationComplete?: () => void;
  onLogoPress?: (x: number, y: number) => void;
}

const LogoAnimation: React.FC<LogoAnimationProps> = ({
  size = 100,
  onAnimationComplete,
  onLogoPress,
}) => {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const rotate = useSharedValue(0);
  const pulseScale = useSharedValue(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    scale.value = withSequence(
      withTiming(1.2, { duration: 800, easing: Easing.out(Easing.back(2)) }),
      withTiming(1, { duration: 400, easing: Easing.inOut(Easing.ease) }),
    );

    opacity.value = withTiming(1, { duration: 800 });

    rotate.value = withSequence(
      withTiming(1, { duration: 800 }),
      withDelay(
        400,
        withTiming(
          0,
          {
            duration: 600,
            easing: Easing.out(Easing.ease),
          },
          () => {
            if (onAnimationComplete) {
              onAnimationComplete();
            }
          },
        ),
      ),
    );
  }, []);

  const handlePress = (event: any) => {
    // Get the position of the tap
    const x = event.nativeEvent.pageX;
    const y = event.nativeEvent.pageY;
    setPosition({ x, y });

    // Animate the logo to pulse when pressed
    pulseScale.value = withSequence(
      withTiming(1.3, { duration: 200, easing: Easing.out(Easing.ease) }),
      withTiming(1, { duration: 300, easing: Easing.inOut(Easing.ease) }),
    );

    // Call the callback to spawn new floating elements
    if (onLogoPress) {
      onLogoPress(x, y);
    }
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [
        {
          scale: interpolate(
            scale.value * pulseScale.value,
            [0, 2],
            [0, 2],
            Extrapolate.CLAMP,
          ),
        },
        { rotate: `${rotate.value * 10}deg` },
      ],
    };
  });

  return (
    <Pressable onPress={handlePress}>
      <Animated.View style={[styles.container, animatedStyle]}>
        <Animated.Image
          source={require("@/assets/images/icon.png")}
          style={[styles.icon, { width: 110, height: 110 }]}
        />
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  text: {
    color: "white",
    fontWeight: "bold",
  },
  icon: {
    resizeMode: "contain",
  },
});

export default LogoAnimation;
