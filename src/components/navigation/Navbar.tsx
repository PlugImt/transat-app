import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
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
  Reservation,
  Restaurant,
  Timetable,
  Traq,
} from "@/app/screens/services";
import ClubDetails from "@/app/screens/services/clubs/ClubDetails";
import { ClubMemberList } from "@/app/screens/services/clubs/components/ClubMemberList";
import ClubEvents from "@/app/screens/services/events/ClubEvents";
import { AddEvent } from "@/app/screens/services/events/components/AddEvent";
import { EditEvent } from "@/app/screens/services/events/components/EditEvent";
import EventDetails from "@/app/screens/services/events/components/EventDetails";
import { EventMemberList } from "@/app/screens/services/events/components/EventMemberList";
import Events from "@/app/screens/services/events/Events";
import Bassine from "@/app/screens/services/games/bassine/Bassine";
import { BassineLeaderboard } from "@/app/screens/services/games/bassine/leaderboard/BassineLeaderboard";
import { HomeworkDetails } from "@/app/screens/services/homework/components/HomeworkDetails";
import {
  Category,
  PersonalReservations,
  ReservationCalendar,
} from "@/app/screens/services/reservation";
import { RestaurantReviews } from "@/app/screens/services/restaurant/components/Reviews";
import { Services } from "@/app/screens/services/Services";
import { useTheme } from "@/contexts/ThemeContext";
import { screenOptions, tabBarOptions } from "@/navigation/navigationConfig";
import type { BottomTabParamList } from "@/types";
import { hapticFeedback } from "@/utils/haptics.utils";

const Tab = createBottomTabNavigator<BottomTabParamList>();
const Stack = createNativeStackNavigator<BottomTabParamList>();

// Stack navigators for each main tab
const HomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="HomeScreen" component={Home} />
    <Stack.Screen name="Laundry" component={Laundry} />
    <Stack.Screen name="Restaurant" component={Restaurant} />
    <Stack.Screen name="RestaurantReviews" component={RestaurantReviews} />
    <Stack.Screen name="Timetable" component={Timetable} />
    <Stack.Screen name="Homework" component={Homework} />
    <Stack.Screen name="HomeworkDetails" component={HomeworkDetails} />
    <Stack.Screen name="Clubs" component={Clubs} />
    <Stack.Screen name="ClubDetails" component={ClubDetails} />
    <Stack.Screen name="ClubMemberList" component={ClubMemberList} />
    <Stack.Screen name="ClubEvents" component={ClubEvents} />
    <Stack.Screen name="Events" component={Events} />
    <Stack.Screen name="EventMemberList" component={EventMemberList} />
    <Stack.Screen name="EventDetails" component={EventDetails} />
    <Stack.Screen name="AddEvent" component={AddEvent} />
    <Stack.Screen name="EditEvent" component={EditEvent} />
    <Stack.Screen name="Traq" component={Traq} />
    <Stack.Screen name="Olimtpe" component={Olimtpe} />
  </Stack.Navigator>
);

const ServicesStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ServicesScreen" component={Services} />
    <Stack.Screen name="Laundry" component={Laundry} />
    <Stack.Screen name="Restaurant" component={Restaurant} />
    <Stack.Screen name="RestaurantReviews" component={RestaurantReviews} />
    <Stack.Screen name="Timetable" component={Timetable} />
    <Stack.Screen name="Homework" component={Homework} />
    <Stack.Screen name="HomeworkDetails" component={HomeworkDetails} />
    <Stack.Screen name="Clubs" component={Clubs} />
    <Stack.Screen name="ClubDetails" component={ClubDetails} />
    <Stack.Screen name="ClubMemberList" component={ClubMemberList} />
    <Stack.Screen name="ClubEvents" component={ClubEvents} />
    <Stack.Screen name="Events" component={Events} />
    <Stack.Screen name="EventMemberList" component={EventMemberList} />
    <Stack.Screen name="EventDetails" component={EventDetails} />
    <Stack.Screen name="AddEvent" component={AddEvent} />
    <Stack.Screen name="EditEvent" component={EditEvent} />
    <Stack.Screen name="Traq" component={Traq} />
    <Stack.Screen name="Olimtpe" component={Olimtpe} />
    <Stack.Screen name="Reservation" component={Reservation} />
    <Stack.Screen name="MyReservations" component={PersonalReservations} />
    <Stack.Screen name="ReservationCategory" component={Category} />
    <Stack.Screen name="ReservationCalendar" component={ReservationCalendar} />
  </Stack.Navigator>
);

const GamesStack = () => (
  <Stack.Navigator screenOptions={screenOptions}>
    <Stack.Screen name="GamesScreen" component={Games} />
    <Stack.Screen name="Bassine" component={Bassine} />
    <Stack.Screen name="BassineLeaderboard" component={BassineLeaderboard} />
  </Stack.Navigator>
);

const AccountStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="AccountScreen" component={Account} />
    <Stack.Screen name="EditProfile" component={EditProfile} />
    <Stack.Screen name="Settings" component={Settings} />
    <Stack.Screen name="ChangePassword" component={ChangePassword} />
    <Stack.Screen name="Notifications" component={Notifications} />
    <Stack.Screen name="Language" component={Language} />
    <Stack.Screen name="Appearance" component={Appearance} />
    <Stack.Screen name="About" component={About} />
    <Stack.Screen name="Help" component={Help} />
    <Stack.Screen name="Legal" component={Legal} />
  </Stack.Navigator>
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
        component={HomeStack}
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
        component={ServicesStack}
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
        component={GamesStack}
        listeners={handleTabPress}
        options={{
          tabBarLabel: t("games.title"),
          tabBarIcon: ({ color, size }) => <Play size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="AccountScreen"
        component={AccountStack}
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
