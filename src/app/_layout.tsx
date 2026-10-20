import "react-native-gesture-handler";
import "@/i18n";
import "./global.css";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import * as Sentry from "@sentry/react-native";
import { QueryClientProvider } from "@tanstack/react-query";
import * as Notifications from "expo-notifications";
import { Stack } from "expo-router/stack";
import { useCallback, useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { queryClient } from "@/api/query-client";
import "@/api/query-client-setup";
import { SplashScreen } from "@/components/animations/SplashScreen";
import { ToastProvider } from "@/components/common/Toast";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { useAuth } from "@/hooks/account/useAuth";
import { usePushNotifications } from "@/hooks/home";
import { shouldShowOnboarding } from "@/hooks/onboarding/useOnboardingSteps";
import { i18nInitializedPromise } from "@/i18n";
import { FinishOnboardingProvider } from "@/navigation/finish-onboarding";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

Sentry.init({
  enabled: !__DEV__,
  dsn: "https://d9bfff43750553d324f8ba16461dbd76@o4509277512859648.ingest.de.sentry.io/4509277515022416",
  sendDefaultPii: true,
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [
    Sentry.mobileReplayIntegration({
      maskAllText: false,
      maskAllImages: false,
      maskAllVectors: false,
    }),
    Sentry.feedbackIntegration(),
  ],
  spotlight: __DEV__,
  environment: __DEV__ ? "development" : "production",
});

const RootGate = () => {
  const { user } = useAuth();
  usePushNotifications();
  const [isI18nReady, setIsI18nReady] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState<boolean | null>(null);
  const finishOnboarding = useCallback(() => setShowOnboarding(false), []);

  useEffect(() => {
    i18nInitializedPromise.then(() => {
      setIsI18nReady(true);
    });
  }, []);

  useEffect(() => {
    if (user === null) {
      setShowOnboarding(false);
      return;
    }
    if (user === undefined || !isI18nReady) return;

    let cancelled = false;
    const timeoutId = setTimeout(() => {
      shouldShowOnboarding()
        .then((shouldShow) => {
          if (!cancelled) setShowOnboarding(shouldShow);
        })
        .catch((error) => {
          console.error("[Onboarding] Error in checkOnboarding:", error);
          if (!cancelled) setShowOnboarding(true);
        });
    }, 100);

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [user, isI18nReady]);

  if (
    user === undefined ||
    !isI18nReady ||
    (user !== null && showOnboarding === null)
  ) {
    return <SplashScreen />;
  }

  const signedIn = user !== null;

  return (
    <FinishOnboardingProvider value={finishOnboarding}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Protected
          guard={signedIn && showOnboarding === false}
          redirectTo={signedIn ? "/start" : "/welcome"}
        >
          <Stack.Screen name="(app)" />
        </Stack.Protected>
        <Stack.Protected
          guard={signedIn && showOnboarding === true}
          redirectTo={signedIn ? "/" : "/welcome"}
        >
          <Stack.Screen name="(onboarding)" />
        </Stack.Protected>
        <Stack.Protected
          guard={!signedIn}
          redirectTo={showOnboarding ? "/start" : "/"}
        >
          <Stack.Screen name="(auth)" />
        </Stack.Protected>
      </Stack>
    </FinishOnboardingProvider>
  );
};

function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <QueryClientProvider client={queryClient}>
            <BottomSheetModalProvider>
              <AuthProvider>
                <ToastProvider position="top">
                  <RootGate />
                </ToastProvider>
              </AuthProvider>
            </BottomSheetModalProvider>
          </QueryClientProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default Sentry.wrap(Layout);
