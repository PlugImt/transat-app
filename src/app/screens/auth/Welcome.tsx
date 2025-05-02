import type { FloatingElementsRef } from "@/components/animations/FloatingElements";
import LogoAnimation from "@/components/animations/LogoAnimation";
import { Button } from "@/components/common/Button";
import Page from "@/components/common/Page";
import type { AuthStackParamList } from "@/services/storage/types";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import { useCallback, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Animated as RNAnimated, Text, View } from "react-native";

type LoginScreenNavigationProp = StackNavigationProp<AuthStackParamList>;

export const Welcome = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<LoginScreenNavigationProp>();

  const fadeAnim = useRef(new RNAnimated.Value(0)).current;
  const slideAnim = useRef(new RNAnimated.Value(50)).current;
  const floatingElementsRef = useRef<FloatingElementsRef>(null);

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

  // Run animation when component mounts
  useEffect(() => {
    startAnimations();
  }, []);

  // Re-run animations when the screen comes back into focus
  useFocusEffect(
    useCallback(() => {
      startAnimations();
      return () => {};
    }, [startAnimations]),
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

  const handleLogoPress = (x: number, y: number) => {
    // Spawn new floating elements from the logo position
    if (floatingElementsRef.current) {
      floatingElementsRef.current.spawnElements(x, y, 8);
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
    <Page footer={buttonsFooter}>
      {/*<FloatingElements count={20}  />*/}

      <View className="flex flex-col items-center justify-center h-full mt-20 bg-transparent">
        <LogoAnimation size={70} onLogoPress={handleLogoPress} />

        <RNAnimated.View
          className="flex flex-col items-center gap-4 mt-6"
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          <Text className="h1 text-5xl text-primary">Transat</Text>
          <Text className="h3 text-center text-foreground">
            {t("welcome.subtitle")}
          </Text>
        </RNAnimated.View>
      </View>
    </Page>
  );
};

export default Welcome;
