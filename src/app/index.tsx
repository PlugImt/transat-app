import { RootNavigator } from "@/app/navigation/RootNavigator";
import "@/i18n";
import "./global.css";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import * as Sentry from "@sentry/react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as Notifications from "expo-notifications";
import { Provider } from "jotai";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Text } from "@/components/common/Text";
import { ToastProvider } from "@/components/common/Toast";
import { apiEnv } from "@/config";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { storage } from "@/services/storage/asyncStorage";
import STORAGE_KEYS from "@/services/storage/constants";

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

  const [isDevServerSelected, setIsDevServerSelected] = useState(false);
  useEffect(() => {
    const fetchIsDevServerSelected = async () => {
      const isDevServerSelected = await storage.get(
        STORAGE_KEYS.IS_DEV_SERVER_SELECTED,
      );
      setIsDevServerSelected(isDevServerSelected === "true");
    };
    fetchIsDevServerSelected();
  }, []);

  return (
    <Provider>
      <ThemeProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <QueryClientProvider client={queryClient}>
            <BottomSheetModalProvider>
              <AuthProvider>
                <ToastProvider position="top">
                  {isDevServerSelected ? (
                    <View className="fixed top-0 left-0">
                      <Text>Dev server selected: {apiEnv.API_URL_DEV}</Text>
                    </View>
                  ) : null}

                  <RootNavigator />
                </ToastProvider>
              </AuthProvider>
            </BottomSheetModalProvider>
          </QueryClientProvider>
        </GestureHandlerRootView>
      </ThemeProvider>
    </Provider>
  );
};

export default Sentry.wrap(App);
