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
import {
  getOnboardingCompleted,
  getOnboardingSkipped,
  useOnboardingSteps,
} from "@/hooks/onboarding/useOnboardingSteps";
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
  const onboardingSteps = useOnboardingSteps(user || null);

  useEffect(() => {
    i18nInitializedPromise.then(() => {
      setIsI18nReady(true);
    });
  }, []);

  useEffect(() => {
    const checkOnboarding = async () => {
      // If user is not logged in, we don't need to check onboarding
      if (!user) {
        setShowOnboarding(false);
        return;
      }

      // Only check onboarding if user is logged in and i18n is ready
      if (!isI18nReady) {
        return;
      }

      const isSkipped = await getOnboardingSkipped();
      const isCompleted = await getOnboardingCompleted();

      if (isSkipped || isCompleted || onboardingSteps.hasCompletedAll) {
        setShowOnboarding(false);
      } else {
        setShowOnboarding(true);
      }
    };

    checkOnboarding();
  }, [user, isI18nReady, onboardingSteps.hasCompletedAll]);

  // Show splash screen while loading or while checking onboarding status
  if (user === undefined || !isI18nReady || (user && showOnboarding === null)) {
    return <SplashScreen />;
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
          showOnboarding ? (
            <Stack.Screen name="Onboarding" options={{ headerShown: false }}>
              {() => (
                <OnboardingNavigator
                  onComplete={() => setShowOnboarding(false)}
                />
              )}
            </Stack.Screen>
          ) : (
            <Stack.Screen name="App" component={AppNavigator} />
          )
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </SafeAreaView>
  );
};

export default RootNavigator;
