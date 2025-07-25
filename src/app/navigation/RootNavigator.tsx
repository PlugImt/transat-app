import { createStackNavigator } from "@react-navigation/stack";
import { useEffect, useState } from "react";
import { AppNavigator } from "@/app/navigation/AppNavigator";
import { AuthNavigator } from "@/app/navigation/AuthNavigator";
import { SplashScreen } from "@/components/animations/SplashScreen";
import { useAuth } from "@/hooks/account/useAuth";
import { usePushNotifications } from "@/hooks/home";
import { i18nInitializedPromise } from "@/i18n";
import { screenOptions } from "@/navigation/navigationConfig";
import type { RootStackParamList } from "@/types";

const Stack = createStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
  const { user } = useAuth();
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
    <Stack.Navigator screenOptions={screenOptions}>
      {user ? (
        <Stack.Screen name="App" component={AppNavigator} />
      ) : (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      )}
    </Stack.Navigator>
  );
};

export default RootNavigator;
