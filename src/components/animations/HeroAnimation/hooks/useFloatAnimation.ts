import { useEffect } from "react";
import {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

/**
 * Hook pour animer un flottement circulaire autour d'une position de base
 * @param amplitude Rayon du cercle de flottement (en px)
 * @param duration Durée d'un tour complet (en ms)
 * @param phase Décalage de phase pour désynchroniser les éléments
 * @param direction Sens de rotation : 1 (horaire), -1 (anti-horaire)
 */
export const useFloatAnimation = (
  amplitude = 2,
  duration = 3000,
  phase = 0,
  direction: 1 | -1 = 1,
) => {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(2 * Math.PI, { duration }),
      -1,
      false,
    );
  }, [duration, progress]);

  const animatedStyle = useAnimatedStyle(() => {
    const angle = direction * progress.value + phase;
    return {
      transform: [
        { translateY: Math.sin(angle) * amplitude },
        { translateX: Math.cos(angle) * amplitude },
      ],
    };
  });

  return animatedStyle;
};
