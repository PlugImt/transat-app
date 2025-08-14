import { createStackNavigator } from "@react-navigation/stack";
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
import Caps from "@/app/screens/games/Caps";
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
import { BottomTabNavigator } from "@/components/navigation/Navbar";
import { screenOptions } from "@/navigation/navigationConfig";
import type { AppStackParamList } from "@/types";

const Stack = createStackNavigator<AppStackParamList>();

export const AppNavigator = () => {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="BottomTabNavigator" component={BottomTabNavigator} />

      {/* Services screens */}
      <Stack.Screen name="Laundry" component={Laundry} />
      <Stack.Screen name="Restaurant" component={Restaurant} />
      <Stack.Screen name="RestaurantReviews" component={RestaurantReviews} />
      <Stack.Screen name="Timetable" component={Timetable} />
      <Stack.Screen name="Homework" component={Homework} />
      <Stack.Screen name="HomeworkDetails" component={HomeworkDetails} />
      <Stack.Screen name="Clubs" component={Clubs} />
      <Stack.Screen name="ClubDetails" component={ClubDetails} />
      <Stack.Screen name="ClubMemberList" component={ClubMemberList} />
      <Stack.Screen name="Events" component={Events} />
      <Stack.Screen name="EventDetails" component={EventDetails} />
      <Stack.Screen name="AddEvent" component={AddEvent} />
      <Stack.Screen name="Traq" component={Traq} />
      <Stack.Screen name="Olimtpe" component={Olimtpe} />

      {/* Account screens */}
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

      {/* Games screens */}
      <Stack.Screen name="Games" component={Games} />
      <Stack.Screen name="Caps" component={Caps} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
