import { createBottomTabNavigator } from "expo-router/build/react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "expo-router/build/react-navigation/native-stack";
import { GridIcon, Images, LucideHome, User } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/contexts/ThemeContext";
import { useIsAcademics } from "@/hooks/account";
import { useNotificationNavigation } from "@/hooks/home/useNotificationNavigation";
import { screenOptions, tabBarOptions } from "@/navigation/navigationConfig";
import { Home } from "@/screens";
import Account from "@/screens/account/Account";
import EditProfile from "@/screens/account/EditAccount";
import About from "@/screens/account/settings/About";
import { Appearance } from "@/screens/account/settings/Appearance";
import ChangePassword from "@/screens/account/settings/ChangePassword";
import Help from "@/screens/account/settings/Help";
import Language from "@/screens/account/settings/Language";
import Legal from "@/screens/account/settings/Legal";
import Notifications from "@/screens/account/settings/Notifications";
import Settings from "@/screens/account/settings/Settings";
import {
  Clubs,
  Fourchettas,
  Homework,
  Laundry,
  Olimtpe,
  Photos,
  Reservation,
  Restaurant,
  Timetable,
  Traq,
} from "@/screens/services";
import ClubDetails from "@/screens/services/clubs/ClubDetails";
import { ClubMemberList } from "@/screens/services/clubs/components/ClubMemberList";
import ClubEvents from "@/screens/services/events/ClubEvents";
import { AddEvent } from "@/screens/services/events/components/AddEvent";
import { EditEvent } from "@/screens/services/events/components/EditEvent";
import EventDetails from "@/screens/services/events/components/EventDetails";
import { EventMemberList } from "@/screens/services/events/components/EventMemberList";
import Events from "@/screens/services/events/Events";
import { FourchettasOrder } from "@/screens/services/fourchettas/components/order/FourchettasOrder";
import { HomeworkDetails } from "@/screens/services/homework/components/HomeworkDetails";
import { AlbumDetails } from "@/screens/services/photos/AlbumDetails";
import {
  Category,
  PersonalReservations,
  ReservationCalendar,
} from "@/screens/services/reservation";
import { RestaurantReviews } from "@/screens/services/restaurant/components/Reviews";
import { Services } from "@/screens/services/Services";
import type { BottomTabParamList } from "@/types";
import { hapticFeedback } from "@/utils/haptics.utils";

const Tab = createBottomTabNavigator<BottomTabParamList>();
type StackParamList = BottomTabParamList & {
  Home: undefined;
  Services: undefined;
  Photos: undefined;
  Account: undefined;
};
const Stack = createNativeStackNavigator<StackParamList>();

// Stack navigators for each main tab
const HomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Home" component={Home} />
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

const ServicesStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Services" component={Services} />
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
    <Stack.Screen name="Fourchettas" component={Fourchettas} />
    <Stack.Screen name="FourchettasOrder" component={FourchettasOrder} />
  </Stack.Navigator>
);

const PhotosStack = () => (
  <Stack.Navigator screenOptions={screenOptions}>
    <Stack.Screen name="Photos" component={Photos} />
    <Stack.Screen name="AlbumDetails" component={AlbumDetails} />
  </Stack.Navigator>
);

const AccountStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Account" component={Account} />
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
  const isAcademics = useIsAcademics();
  const insets = useSafeAreaInsets();

  useNotificationNavigation();

  const handleTabPress = () => {
    return {
      tabPress: () => {
        hapticFeedback.light();
      },
    };
  };

  return (
    <Tab.Navigator screenOptions={tabBarOptions(theme, insets.bottom)}>
      <Tab.Screen
        name="HomeScreen"
        component={HomeStack}
        listeners={handleTabPress}
        options={{
          tabBarLabel: t("common.home"),
          tabBarIcon: ({ color }) => <LucideHome size={24} color={color} />,
        }}
      />
      <Tab.Screen
        name="ServicesScreen"
        component={ServicesStack}
        listeners={handleTabPress}
        options={{
          tabBarLabel: t("services.title"),
          tabBarIcon: ({ color }) => <GridIcon size={24} color={color} />,
        }}
      />
      {!isAcademics && (
        <Tab.Screen
          name="PhotosScreen"
          component={PhotosStack}
          listeners={handleTabPress}
          options={{
            tabBarLabel: t("photos.title"),
            tabBarIcon: ({ color }) => <Images size={24} color={color} />,
          }}
        />
      )}
      <Tab.Screen
        name="AccountScreen"
        component={AccountStack}
        listeners={handleTabPress}
        options={{
          tabBarLabel: t("common.account"),
          tabBarIcon: ({ color }) => <User size={24} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
