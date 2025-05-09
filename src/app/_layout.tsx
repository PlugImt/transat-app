import * as Sentry from "@sentry/react-native";
import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView, View } from "react-native";

Sentry.init({
  dsn: "https://d9bfff43750553d324f8ba16461dbd76@o4509277512859648.ingest.de.sentry.io/4509277515022416",

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  tracesSampleRate: 1.0,

  // Configure Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [
    Sentry.mobileReplayIntegration(),
    Sentry.feedbackIntegration(),
  ],

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  spotlight: __DEV__,

  environment: __DEV__ ? "development" : "production",
});

export default function Layout() {
  return (
    <View className="flex-1 bg-background">
      <StatusBar style="light" translucent={true} backgroundColor="#070402C6" />
      <SafeAreaView className="flex-1 bg-background">
        <Slot />
      </SafeAreaView>
    </View>
  );
}
