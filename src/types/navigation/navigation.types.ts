import type { BottomTabNavigationProp } from "expo-router/build/react-navigation/bottom-tabs";
import type { NativeStackNavigationProp } from "expo-router/build/react-navigation/native-stack";
import type { NavigatorScreenParams } from "expo-router/react-navigation";
import type { Homework, OrderedItem } from "@/dto";

export type BottomTabParamList = {
  // Main tabs
  HomeScreen: undefined;
  ServicesScreen: undefined;
  ScheduleScreen: undefined;
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
  Reservation: undefined;
  MyReservations: undefined;
  ReservationCategory: {
    id: number;
    type: string;
    title: string;
    level?: number;
  };
  ReservationCalendar: { id: number; title: string };
  Fourchettas: undefined;
  FourchettasOrder: { id: number; orderUser?: OrderedItem[] };

  // Account screens
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
  Games:undefined;
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

export type AuthNavigation = NativeStackNavigationProp<AuthStackParamList>;

export type AppStackParamList = {
  Navbar: NavigatorScreenParams<BottomTabParamList>;
};

export type AppNavigation = BottomTabNavigationProp<BottomTabParamList> &
  NativeStackNavigationProp<BottomTabParamList>;

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  App: NavigatorScreenParams<AppStackParamList>;
};

export enum TabRoute {
  Home = "Home",
  Services = "Services",
  Schedule = "Schedule",
  Account = "Account",
}
