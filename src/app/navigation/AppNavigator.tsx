import { createStackNavigator } from "@react-navigation/stack";
import { BottomTabNavigator } from "@/components/navigation/Navbar";
import { screenOptions } from "@/navigation/navigationConfig";
import type { AppStackParamList } from "@/types";

const Stack = createStackNavigator<AppStackParamList>();

export const AppNavigator = () => {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="BottomTabNavigator" component={BottomTabNavigator} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
