import LogoAnimation from "@/components/animations/LogoAnimation";
import { Button } from "@/components/common/Button";
import Page from "@/components/common/Page";
import { useTheme } from "@/themes/useThemeProvider";
import { useCallback, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  Linking,
  Animated as RNAnimated,
  ScrollView,
  Text,
  View,
} from "react-native";

export const About = () => {
  const _theme = useTheme();
  const { t } = useTranslation();
  const triggerConfettiRef = useRef<(() => void) | null>(null);
  const fadeAnim = useRef(new RNAnimated.Value(0)).current;
  const slideAnim = useRef(new RNAnimated.Value(50)).current;

  const handleOpenLink = async (url: string) => {
    try {
      await Linking.openURL(url);
    } catch (error) {
      console.error("Error opening link:", error);
    }
  };

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

  const handleLogoPress = (x: number, y: number) => {
    // Trigger confetti
    if (triggerConfettiRef.current) {
      triggerConfettiRef.current();
    }
  };

  return (
    <Page
      onConfettiTrigger={(trigger) => {
        triggerConfettiRef.current = trigger;
      }}
      confetti={true}
      footer={
        <Text className="text-center text-foreground/40 italic">
          {t("common.plugImtNote")}
        </Text>
      }
    >
      <ScrollView className="flex-1">
        <View className="flex flex-col items-center justify-center  mt-20 bg-transparent">
          <LogoAnimation size={70} onLogoPress={handleLogoPress} />

          <RNAnimated.View
            className="flex flex-col items-center gap-2 mt-6"
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }}
          >
            <Text className="h1 text-5xl text-primary">Transat</Text>
            <Text className="h3 text-center text-foreground">
              {t("welcome.subtitle")}
            </Text>

            <Text className="text-center text-foreground/60 mb-4">
              {t("common.campusApp")}
            </Text>
          </RNAnimated.View>
        </View>

        <RNAnimated.View
          className="gap-6 px-4 mt-4"
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          <View className="bg-card rounded-lg px-6 py-6">
            <Text className="text-foreground/60 mb-4">
              {t("common.credits")}
            </Text>
            <View className="flex-row flex-wrap gap-2">
              <Button
                label="Yohann"
                onPress={() => handleOpenLink("https://github.com/yohann69")}
                variant="outlined"
              />
              <Button
                label="Enzo"
                onPress={() => handleOpenLink("https://github.com/HeineZo")}
                variant="outlined"
              />
              <Button
                label="Lucie"
                onPress={() => handleOpenLink("https://github.com/luclu7")}
                variant="outlined"
              />
              <Button
                label="Matis"
                onPress={() => handleOpenLink("https://github.com/matisbyar")}
                variant="outlined"
              />
              <Button
                label="Zephyr"
                onPress={() =>
                  handleOpenLink("https://github.com/zephyr-dassouli")
                }
                variant="outlined"
              />
              <Button
                label="Maxime"
                onPress={() => handleOpenLink("https://github.com/maxbodin")}
                variant="outlined"
              />
            </View>
          </View>
        </RNAnimated.View>
      </ScrollView>
    </Page>
  );
};

export default About;
