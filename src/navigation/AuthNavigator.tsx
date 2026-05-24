import { createNativeStackNavigator } from "expo-router/build/react-navigation/native-stack";
import Legal from "@/screens/account/settings/Legal";
import { ResetPassword } from "@/screens/auth/ResetPassword";
import { Signin } from "@/screens/auth/Signin";
import { Signup } from "@/screens/auth/Signup";
import Welcome from "@/screens/auth/Welcome";
import { screenOptions } from "@/navigation/navigationConfig";
import type { AuthStackParamList } from "@/types";

const Stack = createNativeStackNavigator<AuthStackParamList>();

export const AuthNavigator = () => {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="Welcome" component={Welcome} />
      <Stack.Screen name="Signin" component={Signin} />
      <Stack.Screen name="Signup" component={Signup} />
      <Stack.Screen name="ResetPassword" component={ResetPassword} />
      <Stack.Screen name="Legal" component={Legal} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
