import { type ReactNode, createContext, useContext } from "react";
import colors from "./colors";

type ThemeType = {
  background: string;
  foreground: string;
  card: string;
  primary: string;
  secondary: string;
  muted: string;
  destructive: string;
  success: string;
  warning: string;
  input: string;
};

const ThemeContext = createContext<ThemeType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  // TODO: fix when the light theme is implemented
  // const colorScheme = useColorScheme() || "dark";
  const colorScheme = "dark";
  const themeColors = colorScheme === "dark" ? colors.dark : colors.light;

  // Add the shared colors to the theme
  const extendedColors = {
    ...themeColors,
    destructive: colors.shared.destructive.DEFAULT,
    success: colors.shared.success.DEFAULT,
    warning: colors.shared.warning.DEFAULT,
  };

  return (
    <ThemeContext.Provider value={extendedColors}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
