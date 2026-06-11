import "@/sentry";
import "react-native-gesture-handler";
import { Stack } from "expo-router";
import { StatusBar } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as Notifications from "expo-notifications";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider as JotaiProvider } from "jotai";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { ToastProvider } from "@/components/common/Toast";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import "@/i18n";
import "./global.css";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <JotaiProvider>
        <ThemeProvider>
          <QueryClientProvider client={queryClient}>
            <BottomSheetModalProvider>
              <AuthProvider>
                <ToastProvider position="top">
                  <StatusBar />
                  <Stack screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="index" />
                    <Stack.Screen name="(auth)" />
                    <Stack.Screen name="(app)" />
                  </Stack>
                </ToastProvider>
              </AuthProvider>
            </BottomSheetModalProvider>
          </QueryClientProvider>
        </ThemeProvider>
      </JotaiProvider>
    </GestureHandlerRootView>
  );
}
