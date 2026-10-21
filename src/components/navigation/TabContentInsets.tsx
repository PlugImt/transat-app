import type { ReactNode } from "react";
import { SafeAreaView } from "react-native-screens/experimental";

/**
 * The tabs are declared with `disableAutomaticContentInsets`, so a tab's content runs under the native tab bar.
 * This keeps it above the bar (and the system navigation bar) on iOS and Android.
 */
export const TabContentInsets = ({ children }: { children: ReactNode }) => (
  <SafeAreaView edges={{ bottom: true }}>{children}</SafeAreaView>
);
