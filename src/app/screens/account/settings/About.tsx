import { Button } from "@/components/common/Button";
import Page from "@/components/common/Page";
import { AnimatedLogo } from "@/components/custom/AnimatedLogo";
import { useTheme } from "@/themes/useThemeProvider";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { Linking, ScrollView, Text, View } from "react-native";

export const About = () => {
  const _theme = useTheme();
  const { t } = useTranslation();
  const triggerConfettiRef = useRef<(() => void) | null>(null);

  const handleOpenLink = async (url: string) => {
    try {
      await Linking.openURL(url);
    } catch (error) {
      console.error("Error opening link:", error);
    }
  };

  const handleLogoPress = () => {
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
        <AnimatedLogo onLogoPress={handleLogoPress} showCampusApp={true} />

        <View className="gap-6 px-4 mt-4">
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
        </View>
      </ScrollView>
    </Page>
  );
};

export default About;
