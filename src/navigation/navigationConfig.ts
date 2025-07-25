import type { BottomTabNavigationOptions } from "@react-navigation/bottom-tabs";
import type { StackNavigationOptions } from "@react-navigation/stack";
import type { ThemeType } from "@/contexts/ThemeContext";

export const screenOptions: StackNavigationOptions = {
  headerShown: false,
  cardStyle: { backgroundColor: "transparent" },
  detachPreviousScreen: false,
};

export const tabBarOptions = (
  theme: ThemeType,
): BottomTabNavigationOptions => ({
  headerShown: false,
  tabBarActiveTintColor: theme.primary,
  tabBarActiveBackgroundColor: theme.card,
  tabBarInactiveTintColor: theme.muted,
  tabBarStyle: {
    backgroundColor: theme.card,
    borderTopWidth: 0,
    paddingTop: 8,
    height: 60,
    paddingBottom: 0,
  },
});
