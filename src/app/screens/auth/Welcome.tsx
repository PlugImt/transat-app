import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { Button } from "@/components/common/Button";
import { AnimatedLogo } from "@/components/custom/AnimatedLogo";
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
        label={t("welcome.login")}
        onPress={() => handleNavigation("Signin")}
      />
      <Button
        variant="secondary"
        label={t("welcome.register")}
        onPress={() => handleNavigation("Signup")}
      />
    </View>
  );

  return (
    <Page
      footer={buttonsFooter}
      onConfettiTrigger={(trigger) => {
        triggerConfettiRef.current = trigger;
      }}
      confetti={true}
    >
      <View className="flex flex-col items-center justify-center h-full">
        <AnimatedLogo onLogoPress={handleLogoPress} />
      </View>
    </Page>
  );
};

export default Welcome;
