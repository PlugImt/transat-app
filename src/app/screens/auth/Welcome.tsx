import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { HeroAnimation } from "@/components/animations/HeroAnimation/HeroAnimation";
import { Button } from "@/components/common/Button";
import { Text } from "@/components/common/Text";
import { Page } from "@/components/page/Page";
import type { AuthStackParamList } from "@/types";

type LoginScreenNavigationProp = StackNavigationProp<AuthStackParamList>;

export const Welcome = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<LoginScreenNavigationProp>();

  const handleNavigation = (route: "Signin" | "Signup") => {
    navigation.navigate(route);
  };

  const buttonsFooter = (
    <View className="flex-row gap-2">
      <Button
        variant="secondary"
        label={t("auth.signUp.title")}
        onPress={() => handleNavigation("Signup")}
        size="lg"
        className="flex-1"
      />
      <Button
        label={t("auth.signIn.title")}
        onPress={() => handleNavigation("Signin")}
        size="lg"
        className="flex-1"
      />
    </View>
  );

  return (
    <Page
      disableScroll
      className="gap-2 items-center flex-1"
      footer={buttonsFooter}
    >
      <HeroAnimation />
      <View className="items-center justify-center max-w-sm">
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
