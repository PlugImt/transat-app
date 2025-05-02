import LogoAnimation from "@/components/animations/LogoAnimation";
import { useCallback, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Animated as RNAnimated, Text, View } from "react-native";

interface AnimatedLogoProps {
  onLogoPress?: (x: number, y: number) => void;
  showSubtitle?: boolean;
  showCampusApp?: boolean;
  size?: number;
}

export const AnimatedLogo = ({
  onLogoPress,
  showSubtitle = true,
  showCampusApp = false,
  size = 70,
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
      <LogoAnimation size={size} onLogoPress={onLogoPress} />

      <RNAnimated.View
        className="flex flex-col items-center gap-2 mt-6"
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }}
      >
        <Text className="h1 text-5xl text-primary">Transat</Text>
        {showSubtitle && (
          <Text className="h3 text-center text-foreground">
            {t("welcome.subtitle")}
          </Text>
        )}
        {showCampusApp && (
          <Text className="text-center text-foreground/60 mb-4">
            {t("common.campusApp")}
          </Text>
        )}
      </RNAnimated.View>
    </View>
  );
};
