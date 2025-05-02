import React, { useEffect } from 'react';
import { StyleSheet, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  Easing
} from 'react-native-reanimated';

interface LogoAnimationProps {
  size?: number;
  onAnimationComplete?: () => void;
}

const LogoAnimation: React.FC<LogoAnimationProps> = ({
  size = 100,
  onAnimationComplete
}) => {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const rotate = useSharedValue(0);

  useEffect(() => {
    scale.value = withSequence(
      withTiming(1.2, { duration: 800, easing: Easing.out(Easing.back(2)) }),
      withTiming(1, { duration: 400, easing: Easing.inOut(Easing.ease) })
    );

    opacity.value = withTiming(1, { duration: 800 });

    rotate.value = withSequence(
      withTiming(1, { duration: 800 }),
      withDelay(400, withTiming(0, {
        duration: 600,
        easing: Easing.out(Easing.ease)
      }, () => {
        if (onAnimationComplete) {
          onAnimationComplete();
        }
      }))
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [
        { scale: scale.value },
        { rotate: `${rotate.value * 10}deg` }
      ]
    };
  });

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <Animated.Image
          source={require("@/assets/images/icon.png")}
          style={[styles.icon, { width: 110, height: 110 }]}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  text: {
    color: 'white',
    fontWeight: 'bold',
  },
  icon: {
    resizeMode: 'contain',
  }
});

export default LogoAnimation;
