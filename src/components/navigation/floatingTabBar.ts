import { isLiquidGlassAvailable } from "expo-glass-effect";
import { createContext, useContext } from "react";
import { Platform } from "react-native";

export const FLOATING_TAB_BAR_HEIGHT = 64;

const computeSupport = () => {
  if (Platform.OS !== "ios") return false;
  try {
    return isLiquidGlassAvailable();
  } catch {
    // Native module missing from this binary (e.g. an older dev client).
    return false;
  }
};

/** True only on iOS 26+ builds; Android and older iOS keep the classic tab bar. */
export const canUseGlassTabBar = computeSupport();

export const getFloatingTabBarBottomOffset = (bottomInset: number) =>
  Math.max(bottomInset - 12, 12);

/** Space a screen must leave at its bottom so the floating tab bar doesn't cover it. */
export const getFloatingTabBarInset = (bottomInset: number) =>
  FLOATING_TAB_BAR_HEIGHT + getFloatingTabBarBottomOffset(bottomInset) + 12;

export const FloatingTabBarInsetContext = createContext(0);

export const useFloatingTabBarInset = () =>
  useContext(FloatingTabBarInsetContext);
