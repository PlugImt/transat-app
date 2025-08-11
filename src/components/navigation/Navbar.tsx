import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { GridIcon, LucideHome, Play, User } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { Home } from "@/app/screens";
import Account from "@/app/screens/account/Account";
import EditProfile from "@/app/screens/account/EditAccount";
import About from "@/app/screens/account/settings/About";
import { Appearance } from "@/app/screens/account/settings/Appearance";
import ChangePassword from "@/app/screens/account/settings/ChangePassword";
import Help from "@/app/screens/account/settings/Help";
import Language from "@/app/screens/account/settings/Language";
import Legal from "@/app/screens/account/settings/Legal";
import Notifications from "@/app/screens/account/settings/Notifications";
import Settings from "@/app/screens/account/settings/Settings";
import {
  Clubs,
  Games,
  Homework,
  Laundry,
  Olimtpe,
  Restaurant,
  Timetable,
  Traq,
} from "@/app/screens/services";
import ClubDetails from "@/app/screens/services/clubs/ClubDetails";
import { ClubMemberList } from "@/app/screens/services/clubs/components/ClubMemberList";
import { AddEvent } from "@/app/screens/services/events/components/AddEvent";
import EventDetails from "@/app/screens/services/events/components/EventDetails";
import Events from "@/app/screens/services/events/Events";
import { HomeworkDetails } from "@/app/screens/services/homework/components/HomeworkDetails";
import { RestaurantReviews } from "@/app/screens/services/restaurant/components/Reviews";
import { Services } from "@/app/screens/services/Services";
import { useTheme } from "@/contexts/ThemeContext";
import { screenOptions, tabBarOptions } from "@/navigation/navigationConfig";
import type { BottomTabParamList } from "@/types";
import { hapticFeedback } from "@/utils/haptics.utils";

const Tab = createBottomTabNavigator<BottomTabParamList>();

// Create stack navigators for each tab
const HomeStack = createStackNavigator();
const HomeStackScreen = () => (
  <HomeStack.Navigator screenOptions={screenOptions}>
    <HomeStack.Screen name="Home" component={Home} />
    <HomeStack.Screen name="Laundry" component={Laundry} />
    <HomeStack.Screen name="Restaurant" component={Restaurant} />
    <HomeStack.Screen name="RestaurantReviews" component={RestaurantReviews} />
    <HomeStack.Screen name="Olimtpe" component={Olimtpe} />
    <HomeStack.Screen name="Timetable" component={Timetable} />
    <HomeStack.Screen name="Homework" component={Homework} />
    <HomeStack.Screen name="HomeworkDetails" component={HomeworkDetails} />
  </HomeStack.Navigator>
);

const ServicesStack = createStackNavigator();
const ServicesStackScreen = () => (
  <ServicesStack.Navigator screenOptions={screenOptions}>
    <ServicesStack.Screen name="Services" component={Services} />
    <ServicesStack.Screen name="Laundry" component={Laundry} />
    <ServicesStack.Screen name="Restaurant" component={Restaurant} />
    <ServicesStack.Screen
      name="RestaurantReviews"
      component={RestaurantReviews}
    />
    <ServicesStack.Screen name="Timetable" component={Timetable} />
    <ServicesStack.Screen name="Homework" component={Homework} />
    <ServicesStack.Screen name="HomeworkDetails" component={HomeworkDetails} />
    <ServicesStack.Screen name="Clubs" component={Clubs} />
    <ServicesStack.Screen name="ClubDetails" component={ClubDetails} />
    <ServicesStack.Screen name="ClubMemberList" component={ClubMemberList} />
    <ServicesStack.Screen name="Events" component={Events} />
    <ServicesStack.Screen name="EventDetails" component={EventDetails} />
    <ServicesStack.Screen name="AddEvent" component={AddEvent} />
    <ServicesStack.Screen name="Traq" component={Traq} />
    <ServicesStack.Screen name="Olimtpe" component={Olimtpe} />
  </ServicesStack.Navigator>
);

const GamesStack = createStackNavigator();
const GamesStackScreen = () => (
  <GamesStack.Navigator screenOptions={screenOptions}>
    <GamesStack.Screen name="Games" component={Games} />
  </GamesStack.Navigator>
);

const AccountStack = createStackNavigator();

const AccountStackScreen = () => (
  <AccountStack.Navigator screenOptions={screenOptions}>
    <AccountStack.Screen name="Account" component={Account} />
    <AccountStack.Screen name="EditProfile" component={EditProfile} />
    <AccountStack.Screen name="Settings" component={Settings} />
    <AccountStack.Screen name="ChangePassword" component={ChangePassword} />
    <AccountStack.Screen name="Notifications" component={Notifications} />
    <AccountStack.Screen name="Language" component={Language} />
    <AccountStack.Screen name="Appearance" component={Appearance} />
    <AccountStack.Screen name="About" component={About} />
    <AccountStack.Screen name="Help" component={Help} />
    <AccountStack.Screen name="Legal" component={Legal} />
  </AccountStack.Navigator>
);

export const BottomTabNavigator = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  const handleTabPress = () => {
    return {
      tabPress: () => {
        hapticFeedback.light();
      },
    };
  };

  return (
    <Tab.Navigator screenOptions={tabBarOptions(theme)}>
      <Tab.Screen
        name="HomeScreen"
        component={HomeStackScreen}
        listeners={handleTabPress}
        options={{
          tabBarLabel: t("common.home"),
          tabBarIcon: ({ color, size }) => (
            <LucideHome size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="ServicesScreen"
        component={ServicesStackScreen}
        listeners={handleTabPress}
        options={{
          tabBarLabel: t("services.title"),
          tabBarIcon: ({ color, size }) => (
            <GridIcon size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="GamesScreen"
        component={GamesStackScreen}
        listeners={handleTabPress}
        options={{
          tabBarLabel: t("games.title"),
          tabBarIcon: ({ color, size }) => <Play size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="AccountScreen"
        component={AccountStackScreen}
        listeners={handleTabPress}
        options={{
          tabBarLabel: t("common.account"),
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
