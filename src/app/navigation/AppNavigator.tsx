import { createStackNavigator } from "@react-navigation/stack";
import { BottomTabNavigator } from "@/components/navigation/Navbar";
import { screenOptions } from "@/navigation/navigationConfig";
import type { AppStackParamList } from "@/services/storage/types";

const Stack = createStackNavigator<AppStackParamList>();

export const AppNavigator = () => {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
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
