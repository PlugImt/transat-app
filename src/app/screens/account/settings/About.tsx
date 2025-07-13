import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { Linking, ScrollView, View } from "react-native";
import { Button } from "@/components/common/Button";
import { Text } from "@/components/common/Text";
import { AnimatedLogo } from "@/components/custom/AnimatedLogo";
import { Page } from "@/components/page/Page";
import { useTheme } from "@/contexts/ThemeContext";

export const About = () => {
  const { theme } = useTheme();
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
      goBack
      onConfettiTrigger={(trigger) => {
        triggerConfettiRef.current = trigger;
      }}
      confetti={true}
      footer={
        <Text className="text-center italic" color="muted">
          {t("common.plugImtNote")}
        </Text>
      }
    >
      <ScrollView className="flex-1">
        <AnimatedLogo onLogoPress={handleLogoPress} showCampusApp={true} />

        <View className="gap-6 px-4 mt-4">
          <View
            className=" rounded-lg px-6 py-6"
            style={{ backgroundColor: theme.card }}
          >
            <Text className="mb-4" color="muted">
              {t("common.credits")}
            </Text>
            <View className="flex-row flex-wrap gap-2">
              <Button
                label="Yohann"
                onPress={() => handleOpenLink("https://github.com/yohann69")}
                variant="secondary"
              />
              <Button
                label="Enzo"
                onPress={() => handleOpenLink("https://github.com/HeineZo")}
                variant="secondary"
              />
              <Button
                label="Lucie"
                onPress={() => handleOpenLink("https://github.com/luclu7")}
                variant="secondary"
              />
              <Button
                label="Matis"
                onPress={() => handleOpenLink("https://github.com/matisbyar")}
                variant="secondary"
              />
              <Button
                label="Zephyr"
                onPress={() =>
                  handleOpenLink("https://github.com/zephyr-dassouli")
                }
                variant="secondary"
              />
              <Button
                label="Maxime"
                onPress={() => handleOpenLink("https://github.com/maxbodin")}
                variant="secondary"
              />
              <Button
                label="Pacôme"
                onPress={() =>
                  handleOpenLink("https://github.com/PacomeCailleteau")
                }
                variant="secondary"
              />
              <Button
                label="Marina"
                onPress={() => handleOpenLink("https://github.com/Enockii")}
                variant="secondary"
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </Page>
  );
};

export default About;
