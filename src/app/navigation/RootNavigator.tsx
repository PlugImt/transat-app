import { AppNavigator } from "@/app/navigation/AppNavigator";
import { AuthNavigator } from "@/app/navigation/AuthNavigator";
import LoadingScreen from "@/components/custom/LoadingScreen";
import { useAuth } from "@/hooks/account/useAuth";
import { i18nInitializedPromise } from "@/i18n";
import type { RootStackParamList } from "@/services/storage/types";
import { createStackNavigator } from "@react-navigation/stack";
import { useEffect, useState } from "react";

const Stack = createStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
  const { user } = useAuth();
  const [isI18nReady, setIsI18nReady] = useState(false);

  useEffect(() => {
    i18nInitializedPromise.then(() => {
      setIsI18nReady(true);
    });
  }, []);

  // pendant qu'on vérifie si l'utilisateur est connecté et que l'i18n est prêt, on affiche un écran de chargement
  if (user === undefined || !isI18nReady) {
    return <LoadingScreen />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <Stack.Screen name="App" component={AppNavigator} />
      ) : (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      )}
    </Stack.Navigator>
  );
};

export default RootNavigator;
