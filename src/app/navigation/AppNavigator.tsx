import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { BottomTabNavigator } from "@/components/navigation/Navbar";
import { screenOptions } from "@/navigation/navigationConfig";
import type { AppStackParamList } from "@/types";

const Stack = createNativeStackNavigator<AppStackParamList>();

export const AppNavigator = () => {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="Navbar" component={BottomTabNavigator} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
