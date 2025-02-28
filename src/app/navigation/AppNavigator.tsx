import { BottomTabNavigator } from "@/components/navigation/Navbar";
import type { AppStackParamList } from "@/services/storage/types";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator<AppStackParamList>();

export const AppNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        // @ts-ignore
        name="Root"
        component={BottomTabNavigator}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
