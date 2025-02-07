import { Login } from "@/app/screens/auth/Login";
import { Register } from "@/app/screens/auth/Register";
import Welcome from "@/app/screens/auth/Welcome";
import type { AuthStackParamList } from "@/services/storage/types";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator<AuthStackParamList>();

export const AuthNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={Welcome} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
