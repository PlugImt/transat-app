import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native";
import { SafeViewAndroid } from "@/app/_layout";
import { AppNavigator } from "@/app/navigation/AppNavigator";
import { AuthNavigator } from "@/app/navigation/AuthNavigator";
import { OnboardingNavigator } from "@/app/navigation/OnboardingNavigator";
import { SplashScreen } from "@/components/animations/SplashScreen";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/hooks/account/useAuth";
import { usePushNotifications } from "@/hooks/home";
import { shouldShowOnboarding } from "@/hooks/onboarding/useOnboardingSteps";
import { i18nInitializedPromise } from "@/i18n";
import { screenOptions } from "@/navigation/navigationConfig";
import type { RootStackParamList } from "@/types";

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  usePushNotifications();
  const [isI18nReady, setIsI18nReady] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState<boolean | null>(null);

  useEffect(() => {
    i18nInitializedPromise.then(() => {
      setIsI18nReady(true);
    });
  }, []);

  useEffect(() => {
    // If user is not logged in, we don't need to check onboarding
    if (user === null) {
      setShowOnboarding(false);
      return;
    }

    // If user is still loading or i18n is not ready, wait
    if (user === undefined || !isI18nReady) {
      return;
    }

    // Check if we should show onboarding
    const checkOnboarding = async () => {
      try {
        const shouldShow = await shouldShowOnboarding();
        setShowOnboarding(shouldShow);
      } catch (error) {
        console.error("[Onboarding] Error in checkOnboarding:", error);
        // On error, show onboarding by default
        setShowOnboarding(true);
      }
    };

    // Add a small delay to ensure storage is updated after verifyCode
    const timeoutId = setTimeout(() => {
      checkOnboarding();
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [user, isI18nReady]);

  // Show splash screen while:
  // - User is still loading (undefined)
  // - i18n is not ready
  // - User is logged in but we're still checking onboarding status
  if (
    user === undefined ||
    !isI18nReady ||
    (user !== null && user !== undefined && showOnboarding === null)
  ) {
    return <SplashScreen />;
  }

  // If showing onboarding, render it full screen without SafeAreaView
  if (user && showOnboarding === true) {
    console.log("[RootNavigator] Rendering OnboardingNavigator");
    return (
      <OnboardingNavigator
        onComplete={() => {
          setShowOnboarding(false);
        }}
      />
    );
  }

  return (
    <SafeAreaView
      style={[
        SafeViewAndroid.AndroidSafeArea,
        { backgroundColor: theme.background },
      ]}
    >
      <Stack.Navigator screenOptions={screenOptions}>
        {user ? (
          <Stack.Screen name="App" component={AppNavigator} />
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </SafeAreaView>
  );
};

export default RootNavigator;
