import * as Sentry from "@sentry/react-native";
import { Slot } from "expo-router";
import { Platform, StatusBar, StyleSheet } from "react-native";

Sentry.init({
  enabled: !__DEV__,
  dsn: "https://d9bfff43750553d324f8ba16461dbd76@o4509277512859648.ingest.de.sentry.io/4509277515022416",

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  tracesSampleRate: 1.0,

  // Configure Session Replay
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

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  spotlight: __DEV__,

  environment: __DEV__ ? "development" : "production",
});

export const SafeViewAndroid = StyleSheet.create({
  AndroidSafeArea: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
});

export default function Layout() {
  return (
    <>
      <StatusBar />
      <Slot />
    </>
  );
}
