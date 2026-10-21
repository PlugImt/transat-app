import { createContext, type ReactNode, useContext } from "react";
import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SafeAreaView } from "react-native-screens/experimental";

// null outside the tabs (auth, onboarding), where there is no tab bar to clear.
const TabBarInsetContext = createContext<number | null>(null);

/** Room a screen's bottom content must leave for the tab bar: 0 on Android, null outside the tabs. */
export const useTabBarInset = () => useContext(TabBarInsetContext);

/**
 * The tabs are declared with `disableAutomaticContentInsets`.
 * iOS: the content runs under the translucent tab bar (liquid glass) and each screen pads its own bottom with `useTabBarInset`.
 * Android: the bar is opaque, so the content simply stops above it and the system navigation bar.
 */
export const TabContentInsets = ({ children }: { children: ReactNode }) => {
  const { bottom } = useSafeAreaInsets();

  if (Platform.OS === "android") {
    return (
      <TabBarInsetContext.Provider value={0}>
        <SafeAreaView edges={{ bottom: true }}>{children}</SafeAreaView>
      </TabBarInsetContext.Provider>
    );
  }
  return (
    <TabBarInsetContext.Provider value={bottom}>
      {children}
    </TabBarInsetContext.Provider>
  );
};
