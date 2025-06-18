import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { GridIcon, LucideHome, Play, User } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import Account from "@/app/screens/account/Account";
import EditProfile from "@/app/screens/account/EditAccount";
import Feedback from "@/app/screens/account/Feedback";
import About from "@/app/screens/account/settings/About";
import { Appearance } from "@/app/screens/account/settings/Appearance";
import ChangePassword from "@/app/screens/account/settings/ChangePassword";
import Help from "@/app/screens/account/settings/Help";
import Language from "@/app/screens/account/settings/Language";
import Legal from "@/app/screens/account/settings/Legal";
import Notifications from "@/app/screens/account/settings/Notifications";
import Settings from "@/app/screens/account/settings/Settings";
import Statistics from "@/app/screens/account/settings/Statistics";
import { Home } from "@/app/screens/Home";
import { Clubs } from "@/app/screens/services/Clubs";
import { EmploiDuTemps } from "@/app/screens/services/EmploiDuTemps";
import Games from "@/app/screens/services/Games";
import { Olimtpe } from "@/app/screens/services/Olimtpe";
import { Restaurant } from "@/app/screens/services/Restaurant";
import { Services } from "@/app/screens/services/Services";
import { Traq } from "@/app/screens/services/Traq";
import { WashingMachine } from "@/app/screens/services/WashingMachine";
import { useTheme } from "@/contexts/ThemeContext";
import type { BottomTabParamList } from "@/types/navigation";

const Tab = createBottomTabNavigator<BottomTabParamList>();

// Create stack navigators for each tab
const HomeStack = createStackNavigator();
const HomeStackScreen = () => (
  <HomeStack.Navigator screenOptions={{ headerShown: false }}>
    <HomeStack.Screen name="HomeScreen" component={Home} />
    <ServicesStack.Screen name="WashingMachine" component={WashingMachine} />
    <ServicesStack.Screen name="Restaurant" component={Restaurant} />
    <ServicesStack.Screen name="Olimtpe" component={Olimtpe} />
    <ServicesStack.Screen name="EmploiDuTemps" component={EmploiDuTemps} />
  </HomeStack.Navigator>
);

const ServicesStack = createStackNavigator();
const ServicesStackScreen = () => (
  <ServicesStack.Navigator screenOptions={{ headerShown: false }}>
    <ServicesStack.Screen name="ServicesScreen" component={Services} />
    <ServicesStack.Screen name="WashingMachine" component={WashingMachine} />
    <ServicesStack.Screen name="Restaurant" component={Restaurant} />
    <ServicesStack.Screen name="EmploiDuTemps" component={EmploiDuTemps} />
    <ServicesStack.Screen name="Clubs" component={Clubs} />
    <ServicesStack.Screen name="Traq" component={Traq} />
    <ServicesStack.Screen name="Olimtpe" component={Olimtpe} />
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
    <AccountStack.Screen name="Feedback" component={Feedback} />
    <AccountStack.Screen name="Settings" component={Settings} />
    <AccountStack.Screen name="ChangePassword" component={ChangePassword} />
    <AccountStack.Screen name="Notifications" component={Notifications} />
    <AccountStack.Screen name="Language" component={Language} />
    <AccountStack.Screen name="Appearance" component={Appearance} />
    <AccountStack.Screen name="About" component={About} />
    <AccountStack.Screen name="Help" component={Help} />
    <AccountStack.Screen name="Statistics" component={Statistics} />
    <AccountStack.Screen name="Legal" component={Legal} />
  </AccountStack.Navigator>
);

export const BottomTabNavigator = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.muted,
        tabBarShowLabel: true,
        tabBarStyle: {
          backgroundColor: theme.card,
          borderTopWidth: 0,
          paddingTop: 8,
          height: 60,
          paddingBottom: 0,
        },
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

export default BottomTabNavigator;
