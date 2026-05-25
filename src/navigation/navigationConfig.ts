import type { BottomTabNavigationOptions } from "expo-router/build/react-navigation/bottom-tabs";
import type { NativeStackNavigationOptions } from "expo-router/build/react-navigation/native-stack";
import type { ThemeType } from "@/contexts/ThemeContext";

export const screenOptions: NativeStackNavigationOptions = {
  headerShown: false,
};

export const tabBarOptions = (
  theme: ThemeType,
): BottomTabNavigationOptions => ({
  headerShown: false,
  tabBarActiveTintColor: theme.primary,
  tabBarActiveBackgroundColor: theme.background,
  tabBarInactiveTintColor: theme.muted,
  tabBarStyle: {
    backgroundColor: theme.background,
    borderTopColor: theme.border,
    paddingTop: 8,
    height: 60,
    paddingBottom: 0,
  },
  headerTitleStyle: {
    backgroundColor: theme.background,
  },
});
