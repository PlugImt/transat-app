import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { HeroAnimation } from "@/components/animations/HeroAnimation";
import { Button } from "@/components/common/Button";
import { Text } from "@/components/common/Text";
import { Page } from "@/components/page/Page";
import type { AuthStackParamList } from "@/types";

type LoginScreenNavigationProp = StackNavigationProp<AuthStackParamList>;

export const Welcome = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<LoginScreenNavigationProp>();

  const triggerConfettiRef = useRef<(() => void) | null>(null);

  const handleNavigation = (route: "Signin" | "Signup") => {
    navigation.navigate(route);
  };

  const handleLogoPress = () => {
    if (triggerConfettiRef.current) {
      triggerConfettiRef.current();
    }
  };

  const buttonsFooter = (
    <View className="gap-2">
      <Button
        label={t("welcome.signin")}
        onPress={() => handleNavigation("Signin")}
      />
      <Button
        variant="secondary"
        label={t("welcome.signup")}
        onPress={() => handleNavigation("Signup")}
      />
    </View>
  );

  return (
    <Page
      disableScroll
      onConfettiTrigger={(trigger) => {
        triggerConfettiRef.current = trigger;
      }}
      confetti={true}
      className="gap-2 items-center flex-1"
      footer={buttonsFooter}
    >
      <HeroAnimation className="mt-40" />
      <View className="items-center justify-center gap-2">
        <Text variant="h1" className="text-center">
          Transat
        </Text>
        <Text variant="lg" className="text-center">
          {t("welcome.subtitle")}
        </Text>
      </View>
    </Page>
  );
};

export default Welcome;
