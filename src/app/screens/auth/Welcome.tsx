import { useFocusEffect, useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import { useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Button } from "@/components/common/Button";
import { AnimatedLogo } from "@/components/custom/AnimatedLogo";
import { Page } from "@/components/page/Page";
import type { AuthStackParamList } from "@/services/storage/types";

type LoginScreenNavigationProp = StackNavigationProp<AuthStackParamList>;

export const Welcome = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<LoginScreenNavigationProp>();

  const opacity = useSharedValue(0);
  const triggerConfettiRef = useRef<(() => void) | null>(null);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  // Re-run animations when the screen comes back into focus
  useFocusEffect(
    useCallback(() => {
      opacity.value = 0;
      opacity.value = withTiming(1, { duration: 1200 });
      return () => {};
    }, [opacity]),
  );

  const handleNavigation = (route: "Signin" | "Signup") => {
    navigation.navigate(route);
  };

  const handleLogoPress = () => {
    if (triggerConfettiRef.current) {
      triggerConfettiRef.current();
    }
  };

  const buttonsFooter = (
    <Animated.View
      className="flex flex-row gap-4 w-full mb-9"
      style={animatedStyle}
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
    </Animated.View>
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
