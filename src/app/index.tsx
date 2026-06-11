import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native";
import { SplashScreen } from "@/components/animations/SplashScreen";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/hooks/account/useAuth";
import { usePushNotifications } from "@/hooks/home";
import { i18nInitializedPromise } from "@/i18n";
import { SafeViewAndroid } from "@/utils/safe-area.utils";

export default function Index() {
  const { user } = useAuth();
  const { theme } = useTheme();
  usePushNotifications();
  const [isI18nReady, setIsI18nReady] = useState(false);

  useEffect(() => {
    i18nInitializedPromise.then(() => setIsI18nReady(true));
  }, []);

  if (user === undefined || !isI18nReady) {
    return <SplashScreen />;
  }

  return (
    <SafeAreaView
      style={[
        SafeViewAndroid.AndroidSafeArea,
        { backgroundColor: theme.background },
      ]}
    >
      {user ? (
        <Redirect href="/(app)/(tabs)/(home)" />
      ) : (
        <Redirect href="/(auth)/Welcome" />
      )}
    </SafeAreaView>
  );
}
