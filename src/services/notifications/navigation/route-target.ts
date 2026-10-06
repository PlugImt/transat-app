import type { NavigatorScreenParams } from "expo-router/react-navigation";
import type { BottomTabParamList } from "@/types";

type TabName =
  | "HomeScreen"
  | "ServicesScreen"
  | "GamesScreen"
  | "AccountScreen";

type ScreenName = keyof BottomTabParamList;

/** A screen to open, addressed through the tab whose stack hosts it. */
export type RouteTarget = {
  tab: TabName;
  screen: ScreenName;
  params?: object;
};

/** Screens that take no route params. */
export type ParameterlessScreen = {
  [S in ScreenName]: BottomTabParamList[S] extends undefined ? S : never;
}[ScreenName];

type ScreenArgs<S extends ScreenName> = BottomTabParamList[S] extends undefined
  ? []
  : [params: BottomTabParamList[S]];

/** Route inside the Services stack, which hosts every service screen. */
export const servicesRoute = <S extends ScreenName>(
  screen: S,
  ...args: ScreenArgs<S>
): RouteTarget => ({
  tab: "ServicesScreen",
  screen,
  params: (args as [object?])[0],
});

/**
 * Params for `navigate("Navbar", ...)`. `initial: false` keeps the stack's root
 * screen underneath so "back" leaves the opened page instead of exiting the tab.
 */
export const toNavbarParams = ({
  tab,
  screen,
  params,
}: RouteTarget): NavigatorScreenParams<BottomTabParamList> =>
  // Nested stack screens (Events, Restaurant...) aren't part of the tab param list.
  ({
    screen: tab,
    params: { screen, params, initial: false },
  }) as unknown as NavigatorScreenParams<BottomTabParamList>;
