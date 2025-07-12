import { useCallback, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Animated as RNAnimated, View } from "react-native";
import LogoAnimation from "@/components/animations/LogoAnimation";
import { Text } from "@/components/common/Text";

interface AnimatedLogoProps {
  onLogoPress?: (x: number, y: number) => void;
  showSubtitle?: boolean;
  showCampusApp?: boolean;
}

export const AnimatedLogo = ({
  onLogoPress,
  showSubtitle = true,
  showCampusApp = false,
}: AnimatedLogoProps) => {
  const { t } = useTranslation();
  const fadeAnim = useRef(new RNAnimated.Value(0)).current;
  const slideAnim = useRef(new RNAnimated.Value(50)).current;

  // Animation function that can be reused
  const startAnimations = useCallback(() => {
    // Reset animation values
    fadeAnim.setValue(0);
    slideAnim.setValue(50);

    // Start animations
    RNAnimated.parallel([
      RNAnimated.timing(fadeAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
      RNAnimated.timing(slideAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  useEffect(() => {
    startAnimations();
  }, [startAnimations]);

  return (
    <View className="flex flex-col items-center justify-center mt-20 bg-transparent">
      <LogoAnimation onLogoPress={onLogoPress} />

      <RNAnimated.View
        className="flex flex-col items-center gap-2 mt-6"
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }}
      >
        <Text variant="h1" className="text-5xl" color="primary">
          Transat
        </Text>
        {showSubtitle && (
          <Text className="text-center" variant="h3" color="muted">
            {t("welcome.subtitle")}
          </Text>
        )}
        {showCampusApp && (
          <Text className="text-center mb-4" color="textSecondary">
            {t("common.campusApp")}
          </Text>
        )}
      </RNAnimated.View>
    </View>
  );
};
