import { MotiView } from "moti";
import type { ReactNode } from "react";
import { useTheme } from "@/contexts/ThemeContext";

export const FLOATING_ACTION_BAR_HEIGHT = 76;
/** Distance from the bottom of the screen area, which already ends above the tab bar. */
export const FLOATING_ACTION_BAR_BOTTOM = 12;

type FloatingActionBarProps = {
  children: ReactNode;
  height?: number;
};

/** Card pinned to the bottom of a screen, fading in, for the actions of a selection or a page. */
export const FloatingActionBar = ({
  children,
  height = FLOATING_ACTION_BAR_HEIGHT,
}: FloatingActionBarProps) => {
  const { theme } = useTheme();

  return (
    <MotiView
      from={{ opacity: 0, translateY: 24 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: "timing", duration: 200 }}
      className="absolute left-4 right-4 flex-row items-center gap-3 rounded-2xl border px-4"
      style={{
        bottom: FLOATING_ACTION_BAR_BOTTOM,
        height,
        backgroundColor: theme.card,
        borderColor: theme.border,
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
        elevation: 8,
      }}
    >
      {children}
    </MotiView>
  );
};
