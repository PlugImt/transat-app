import { CardStyleInterpolators } from "@react-navigation/stack";
import type { StackNavigationOptions } from "@react-navigation/stack";
import { useTheme } from "@/themes/useThemeProvider";

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
