import type { StackNavigationOptions } from "@react-navigation/stack";
import { CardStyleInterpolators } from "@react-navigation/stack";

export const screenOptions: StackNavigationOptions = {
  headerShown: false,
  cardStyle: { backgroundColor: "transparent" },
  cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter,
  transitionSpec: {
    open: {
      animation: "timing",
      config: {
        duration: 300,
      },
    },
    close: {
      animation: "timing",
      config: {
        duration: 300,
      },
    },
  },
};
