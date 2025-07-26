import { createStackNavigator } from "@react-navigation/stack";
import Legal from "@/app/screens/account/settings/Legal";
import { ResetPassword } from "@/app/screens/auth/ResetPassword";
import { Signin } from "@/app/screens/auth/Signin";
import { Signup } from "@/app/screens/auth/Signup";
import Welcome from "@/app/screens/auth/Welcome";
import { screenOptions } from "@/navigation/navigationConfig";
import type { AuthStackParamList } from "@/types";

const Stack = createStackNavigator<AuthStackParamList>();

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
