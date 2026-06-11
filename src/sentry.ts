import * as Sentry from "@sentry/react-native";

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

export { Sentry };
