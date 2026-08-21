import { createNativeStackNavigator } from "expo-router/build/react-navigation/native-stack";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { SplashScreen } from "@/components/animations/SplashScreen";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/hooks/account/useAuth";
import { usePushNotifications } from "@/hooks/home";
import { i18nInitializedPromise } from "@/i18n";
import { AppNavigator } from "@/navigation/AppNavigator";
import { AuthNavigator } from "@/navigation/AuthNavigator";
import { screenOptions } from "@/navigation/navigationConfig";
import type { RootStackParamList } from "@/types";

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
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
      style={{ flex: 1, backgroundColor: theme.background }}
      edges={user ? ["top", "left", "right"] : ["top", "bottom", "left", "right"]}
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
