import { createNativeStackNavigator } from "expo-router/build/react-navigation/native-stack";
import { useEffect, useState } from "react";
import { SplashScreen } from "@/components/animations/SplashScreen";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/hooks/account/useAuth";
import { usePushNotifications } from "@/hooks/home";
import { i18nInitializedPromise } from "@/i18n";
import { AppNavigator } from "@/navigation/AppNavigator";
import { AuthNavigator } from "@/navigation/AuthNavigator";
import { screenOptions } from "@/navigation/navigationConfig";
import type { RootStackParamList } from "@/types";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  usePushNotifications();
  const [isI18nReady, setIsI18nReady] = useState(false);

  useEffect(() => {
    i18nInitializedPromise.then(() => {
      setIsI18nReady(true);
    });
  }, []);

  if (user === undefined || !isI18nReady) {
    return <SplashScreen />;
  }

  return (
    <SafeAreaView
      edges={["top"]}
      style={[{ flex: 1, paddingBottom: insets.bottom, backgroundColor: "#ff0000" }]}
    >
      <Stack.Navigator screenOptions={screenOptions}>
        {user ? (
          <Stack.Screen name="App" component={AppNavigator} />
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </SafeAreaView>
  );
};

export default RootNavigator;
