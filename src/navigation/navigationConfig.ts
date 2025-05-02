import {
  CardStyleInterpolators,
  TransitionPresets,
} from "@react-navigation/stack";
import type { StackNavigationOptions } from "@react-navigation/stack";

export const screenOptions: StackNavigationOptions = {
  // Keep your existing options
  headerShown: false,
  cardStyle: { backgroundColor: "#070402" },

  ...TransitionPresets.SlideFromRightIOS,

  cardStyleInterpolator: CardStyleInterpolators.forFadeFromBottomAndroid,
};
