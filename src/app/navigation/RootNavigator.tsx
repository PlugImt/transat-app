import { AppNavigator } from "@/app/navigation/AppNavigator";
import { AuthNavigator } from "@/app/navigation/AuthNavigator";
import LoadingScreen from "@/components/custom/LoadingScreen";
import { useAuth } from "@/hooks/account/useAuth";
import type { RootStackParamList } from "@/services/storage/types";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
  const { user } = useAuth();

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
