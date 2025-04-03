import { RootNavigator } from "@/app/navigation/RootNavigator";
import "../i18n";
import "./global.css";
import { ToastProvider } from "@/components/common/Toast";
import { AuthProvider } from "@/contexts/AuthContext";
import { apiUrlDev } from "@/lib/config";
import { storage } from "@/services/storage/asyncStorage";
import { ThemeProvider } from "@/themes/useThemeProvider";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as Clipboard from "expo-clipboard";
import * as Notifications from "expo-notifications";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { DevToolsBubble } from "react-native-react-query-devtools";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function App() {
  const queryClient = new QueryClient();

  const onCopy = async (text: string) => {
    try {
      await Clipboard.setStringAsync(text);
      return true;
    } catch {
      return false;
    }
  };

  const [isDevServerSelected, setIsDevServerSelected] = useState(false);
  useEffect(() => {
    const fetchIsDevServerSelected = async () => {
      const isDevServerSelected = await storage.get("isDevServerSelected");
      setIsDevServerSelected(isDevServerSelected === "true");
    };
    fetchIsDevServerSelected();
  }, []);

  return (
    <ThemeProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <QueryClientProvider client={queryClient}>
          <BottomSheetModalProvider>
            <AuthProvider>
              <ToastProvider position="top">
                {isDevServerSelected ? (
                  <View className="fixed top-0 left-0">
                    <Text className="text-white">
                      Dev server selected: {apiUrlDev}
                    </Text>
                  </View>
                ) : null}

                <RootNavigator />
              </ToastProvider>
            </AuthProvider>
          </BottomSheetModalProvider>
          <DevToolsBubble />
        </QueryClientProvider>
      </GestureHandlerRootView>
    </ThemeProvider>
  );
}
