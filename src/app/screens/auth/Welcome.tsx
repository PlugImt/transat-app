import { useFocusEffect, useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import { useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Animated as RNAnimated, View } from "react-native";
import { Button } from "@/components/common/Button";
import { Page } from "@/components/common/Page";
import { AnimatedLogo } from "@/components/custom/AnimatedLogo";
import type { AuthStackParamList } from "@/services/storage/types";

type LoginScreenNavigationProp = StackNavigationProp<AuthStackParamList>;

export const Welcome = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<LoginScreenNavigationProp>();

  const fadeAnim = useRef(new RNAnimated.Value(0)).current;
  const triggerConfettiRef = useRef<(() => void) | null>(null);

  // Re-run animations when the screen comes back into focus
  useFocusEffect(
    useCallback(() => {
      fadeAnim.setValue(0);
      RNAnimated.timing(fadeAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }).start();
      return () => {};
    }, [fadeAnim]),
  );

  const handleNavigation = (route: keyof AuthStackParamList) => {
    // Fade out when navigating
    RNAnimated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      navigation.navigate(route);
    });
  };

  const handleLogoPress = () => {
    if (triggerConfettiRef.current) {
      triggerConfettiRef.current();
    }
  };

  const buttonsFooter = (
    <RNAnimated.View
      className="flex flex-row gap-4 w-full mb-9"
      style={{ opacity: fadeAnim }}
    >
      <Button
        size="lg"
        label={t("welcome.login")}
        onPress={() => handleNavigation("Signin")}
        className="flex-1"
      />
      <Button
        size="lg"
        variant="outlined"
        label={t("welcome.register")}
        onPress={() => handleNavigation("Signup")}
        className="flex-1"
      />
    </RNAnimated.View>
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
