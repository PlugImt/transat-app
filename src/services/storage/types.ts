import type { NavigatorScreenParams } from "@react-navigation/core";
import type { StackNavigationProp } from "@react-navigation/stack";
import type { Homework } from "@/types/homework";

export type StorageItemValue = string | object | null;

export interface StorageItem {
  value: StorageItemValue;
  timestamp: number;
  expiry?: number; // Time in milliseconds
}

// Auth Stack Types
export type AuthStackParamList = {
  Welcome: undefined;
  Signin: undefined;
  Signup: undefined;
  ResetPassword: { email: string };
};

export interface StorageService {
  get<T>(key: string): Promise<T | null>;

  set(key: string, value: StorageItemValue, expiry?: number): Promise<boolean>;

  remove(key: string): Promise<boolean>;

  clear(): Promise<boolean>;

  getAllKeys(): Promise<string[]>;

  multiGet(keys: string[]): Promise<Array<[string, StorageItemValue]>>;

  multiSet(keyValuePairs: Array<[string, StorageItemValue]>): Promise<boolean>;

  multiRemove(keys: string[]): Promise<boolean>;
}

// Main App Stack Types
export type AppStackParamList = {
  Home: undefined;
  WashingMachine: undefined;
  Restaurant: undefined;
  EmploiDuTemps: undefined;
  Homework: undefined;
  HomeworkDetails: { homework: Homework };
  Games: undefined;
  Profile: {
    userId: string;
  };
  BottomTabNavigator: undefined;
  Clubs: undefined;
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

// Root Stack Types
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

export default StorageService;
