import { Home } from "@/app/screens/Home";
import { Clubs } from "@/app/screens/services/Clubs";
import Games from "@/app/screens/services/Games";
import { Restaurant } from "@/app/screens/services/Restaurant";
import { Services } from "@/app/screens/services/Services";
import { Traq } from "@/app/screens/services/Traq";
import { WashingMachine } from "@/app/screens/services/WashingMachine";
import Account from "@/app/screens/services/account/Account";
import ChangePassword from "@/app/screens/services/account/ChangePassword";
import EditProfile from "@/app/screens/services/account/EditAccount";
import Notifications from "@/app/screens/services/account/Notifications";
import Settings from "@/app/screens/services/account/Settings";
import type { BottomTabParamList } from "@/types/navigation";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { GridIcon, LucideHome, Play, User } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";

const Tab = createBottomTabNavigator<BottomTabParamList>();

// Create stack navigators for each tab
const HomeStack = createStackNavigator();
const HomeStackScreen = () => (
  <HomeStack.Navigator screenOptions={{ headerShown: false }}>
    <HomeStack.Screen name="HomeScreen" component={Home} />
    <ServicesStack.Screen name="WashingMachine" component={WashingMachine} />
    <ServicesStack.Screen name="Restaurant" component={Restaurant} />
  </HomeStack.Navigator>
);

const ServicesStack = createStackNavigator();
const ServicesStackScreen = () => (
  <ServicesStack.Navigator screenOptions={{ headerShown: false }}>
    <ServicesStack.Screen name="ServicesScreen" component={Services} />
    <ServicesStack.Screen name="WashingMachine" component={WashingMachine} />
    <ServicesStack.Screen name="Restaurant" component={Restaurant} />
    <ServicesStack.Screen name="Clubs" component={Clubs} />
    <ServicesStack.Screen name="Traq" component={Traq} />
  </ServicesStack.Navigator>
);

const GamesStack = createStackNavigator();
const GamesStackScreen = () => (
  <GamesStack.Navigator screenOptions={{ headerShown: false }}>
    <GamesStack.Screen name="GamesScreen" component={Games} />
  </GamesStack.Navigator>
);

const AccountStack = createStackNavigator();
const AccountStackScreen = () => (
  <AccountStack.Navigator screenOptions={{ headerShown: false }}>
    <AccountStack.Screen name="AccountScreen" component={Account} />
    <AccountStack.Screen name="EditProfile" component={EditProfile} />
    <AccountStack.Screen name="Settings" component={Settings} />
    <AccountStack.Screen name="ChangePassword" component={ChangePassword} />
    <AccountStack.Screen name="Notifications" component={Notifications} />
  </AccountStack.Navigator>
);

export const BottomTabNavigator = () => {
  const { t } = useTranslation();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#ec7f32",
        tabBarShowLabel: true,
        tabBarStyle: styles.tabBar,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStackScreen}
        options={{
          tabBarLabel: t("common.home"),
          tabBarIcon: ({ color, size }) => (
            <LucideHome size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Services"
        component={ServicesStackScreen}
        options={{
          tabBarLabel: t("services.title"),
          tabBarIcon: ({ color, size }) => (
            <GridIcon size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Games"
        component={GamesStackScreen}
        options={{
          tabBarLabel: t("games.title"),
          tabBarIcon: ({ color, size }) => <Play size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Account"
        component={AccountStackScreen}
        options={{
          tabBarLabel: t("common.account"),
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "#0D0505",
    borderTopWidth: 0,
    paddingTop: 8,
    height: 60,
    paddingBottom: 0,
  },
});

export default BottomTabNavigator;
