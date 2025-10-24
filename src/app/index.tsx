import { RootNavigator } from "@/app/navigation/RootNavigator";
import "@/i18n";
import "./global.css";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import * as Sentry from "@sentry/react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as Notifications from "expo-notifications";
import { HeroUINativeProvider } from "heroui-native";
import { Provider } from "jotai";
import { ToastProvider } from "@/components/common/Toast";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});
const App = () => {
  const queryClient = new QueryClient();

  return (
    <Provider>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <ToastProvider position="top">
            <HeroUINativeProvider>
              <BottomSheetModalProvider>
                <AuthProvider>
                  <RootNavigator />
                </AuthProvider>
              </BottomSheetModalProvider>
            </HeroUINativeProvider>
          </ToastProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </Provider>
  );
};

export default Sentry.wrap(App);
