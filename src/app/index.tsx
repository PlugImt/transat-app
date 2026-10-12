import { RootNavigator } from "@/navigation/RootNavigator";
import "@/i18n";
import "./global.css";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import * as Sentry from "@sentry/react-native";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/api/query-client";
import "@/api/query-client-setup";
import { ToastProvider } from "@/components/common/Toast";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { installNotificationHandler } from "@/services/notifications/presentation";

installNotificationHandler();
const App = () => {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <BottomSheetModalProvider>
          <AuthProvider>
            <ToastProvider position="top">
              <RootNavigator />
            </ToastProvider>
          </AuthProvider>
        </BottomSheetModalProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default Sentry.wrap(App);
