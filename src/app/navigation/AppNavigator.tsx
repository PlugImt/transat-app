import Home from "@/app/screens/Home";
import Account from "@/app/screens/services/Account";
import { Clubs } from "@/app/screens/services/Clubs";
import EditProfile from "@/app/screens/services/EditAccount";
import { Restaurant } from "@/app/screens/services/Restaurant";
import { Traq } from "@/app/screens/services/Traq";
import { WashingMachine } from "@/app/screens/services/WashingMachine";
import { BottomTabNavigator } from "@/components/navigation/Navbar";
import type { AppStackParamList } from "@/services/storage/types";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator<AppStackParamList>();

export const AppNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="BottomTabNavigator" component={BottomTabNavigator} />
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="WashingMachine" component={WashingMachine} />
      <Stack.Screen name="Restaurant" component={Restaurant} />
      <Stack.Screen name="Traq" component={Traq} />
      <Stack.Screen name="Clubs" component={Clubs} />
      <Stack.Screen name="Account" component={Account} />
      <Stack.Screen name="EditProfile" component={EditProfile} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
