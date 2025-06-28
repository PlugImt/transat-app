import { createStackNavigator } from "@react-navigation/stack";
import { ResetPassword } from "@/app/screens/auth/ResetPassword";
import { Signin } from "@/app/screens/auth/Signin";
import { Signup } from "@/app/screens/auth/Signup";
import Welcome from "@/app/screens/auth/Welcome";
import { useTheme } from "@/contexts/ThemeContext";
import { screenOptions } from "@/navigation/navigationConfig";
import type { AuthStackParamList } from "@/services/storage/types";

const Stack = createStackNavigator<AuthStackParamList>();

export const AuthNavigator = () => {
  const _theme = useTheme();

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="Welcome" component={Welcome} />
      <Stack.Screen name="Signin" component={Signin} />
      <Stack.Screen name="Signup" component={Signup} />
      <Stack.Screen name="ResetPassword" component={ResetPassword} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
