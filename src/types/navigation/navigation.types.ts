import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import type { NavigatorScreenParams } from "@react-navigation/core";
import type { StackNavigationProp } from "@react-navigation/stack";
import type { Homework } from "@/dto";

export type BottomTabParamList = {
  // Main tabs
  HomeScreen: undefined;
  ServicesScreen: undefined;
  GamesScreen: undefined;
  AccountScreen: undefined;

  // Services screens
  Laundry: undefined;
  Restaurant: undefined;
  RestaurantReviews: { id: number };
  Timetable: undefined;
  Homework: undefined;
  HomeworkDetails: { homework: Homework };
  Clubs: undefined;
  ClubDetails: { id: number };
  ClubMemberList: { id: number };
  ClubEvents: { id: number };
  EventMemberList: { id: number };
  Events: undefined;
  EventDetails: { id: number };
  AddEvent: undefined;
  EditEvent: { id: number };
  Traq: undefined;
  Olimtpe: undefined;

  // Account screens
  Account: undefined;
  EditProfile: undefined;
  Settings: undefined;
  ChangePassword: undefined;
  Notifications: undefined;
  Language: undefined;
  Appearance: undefined;
  About: undefined;
  Help: undefined;
  Legal: undefined;

  // Games screens
  Games: undefined;
  Caps: undefined;
  Bassine: undefined;
  BassineLeaderboard: undefined;
};

export type BottomTabNavigation = BottomTabNavigationProp<BottomTabParamList>;

export type AuthStackParamList = {
  Welcome: undefined;
  Signin: undefined;
  Signup: undefined;
  ResetPassword: { email: string };
  Legal: undefined;
};

export type AuthNavigation = StackNavigationProp<AuthStackParamList>;

export type AppStackParamList = {
  Navbar: NavigatorScreenParams<BottomTabParamList>;
};

export type AppNavigation = BottomTabNavigationProp<BottomTabParamList> &
  StackNavigationProp<BottomTabParamList>;

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  App: NavigatorScreenParams<AppStackParamList>;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export enum TabRoute {
  Home = "HomeScreen",
  Services = "ServicesScreen",
  Games = "GamesScreen",
  Account = "AccountScreen",
}
