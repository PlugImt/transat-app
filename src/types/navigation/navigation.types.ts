import type { NavigatorScreenParams } from "@react-navigation/core";
import type { StackNavigationProp } from "@react-navigation/stack";
import type { Homework } from "@/dto";

export type BottomTabParamList = {
  AccountScreen: undefined;
  HomeScreen: undefined;
  ServicesScreen: undefined;
  GamesScreen: undefined;
};

export default BottomTabParamList;

export type AuthStackParamList = {
  Welcome: undefined;
  Signin: undefined;
  Signup: undefined;
  ResetPassword: { email: string };
  Legal: undefined;
};

export type AuthNavigation = StackNavigationProp<AuthStackParamList>;

export type AppStackParamList = {
  Home: undefined;
  Laundry: undefined;
  Restaurant: undefined;
  RestaurantReviews: { id: number };
  Timetable: undefined;
  Homework: undefined;
  HomeworkDetails: { homework: Homework };
  Games: undefined;
  Profile: {
    userId: string;
  };
  BottomTabNavigator: undefined;
  Clubs: undefined;
  Reservation: undefined;
  ReservationCategory: {
    id: number;
    type: string;
    title: string;
    level?: number;
  };
  ClubDetails: { id: number };
  Traq: undefined;
  Olimtpe: undefined;
  Account: undefined;
};

type AccountStackParamList = {
  Account: undefined;
  EditProfile: undefined;
  Settings: undefined;
  ChangePassword: undefined;
  Feedback: undefined;
};
export type AccountNavigation = StackNavigationProp<AccountStackParamList>;

type SettingsStackParamList = {
  Account: undefined;
  EditProfile: undefined;
  ChangePassword: undefined;
  Notifications: undefined;
  Language: undefined;
  Appearance: undefined;
  About: undefined;
  Help: undefined;
  Statistics: undefined;
  Legal: undefined;
};
export type SettingsNavigation = StackNavigationProp<SettingsStackParamList>;

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  App: NavigatorScreenParams<AppStackParamList>;
};

// Navigation Types for useNavigation hook
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export enum TabRoute {
  Home = "Home",
  Services = "Services",
  Games = "Games",
  Account = "Account",
  Welcome = "Welcome",
}
