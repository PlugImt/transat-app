import { AppNavigator } from "@/app/navigation/AppNavigator";
import { AuthNavigator } from "@/app/navigation/AuthNavigator";
import { Dialog } from "@/components/common/Dialog";
import { useAuth } from "@/hooks/useAuth";
import { storage } from "@/services/storage/asyncStorage";
import type {
  AppStackParamList,
  RootStackParamList,
} from "@/services/storage/types";
import {
  type StackNavigationProp,
  createStackNavigator,
} from "@react-navigation/stack";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

type AppScreenNavigationProp = StackNavigationProp<AppStackParamList>;

const Stack = createStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
  const { user, setUser } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    checkUser().then((r) => r);
  }, []);

  const checkUser = async () => {
    try {
      const userData = await storage.get("token");
      if (userData) {
        setUser(userData);
        setIsLogged(true);
      }
    } catch (error) {
      console.error("Error checking user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    // <NavigationContainer>
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isLogged ? (
        <Stack.Screen name="App" component={AppNavigator} />
      ) : (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      )}
    </Stack.Navigator>
    // </NavigationContainer>
  );
};

export default RootNavigator;
