import { AppNavigator } from "@/app/navigation/AppNavigator";
import { AuthNavigator } from "@/app/navigation/AuthNavigator";
import LoadingScreen from "@/components/custom/LoadingScreen";
import { useAuth } from "@/hooks/account/useAuth";
import { storage } from "@/services/storage/asyncStorage";
import type {
  AppStackParamList,
  RootStackParamList,
} from "@/services/storage/types";
import {
  type StackNavigationProp,
  createStackNavigator,
} from "@react-navigation/stack";
import { useEffect } from "react";

type AppScreenNavigationProp = StackNavigationProp<AppStackParamList>;

const Stack = createStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
  const { user, saveToken, setUser } = useAuth();

  // pendant qu'on vérifie si l'utilisateur est connecté, on affiche un écran de chargement
  if (user === undefined) {
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
