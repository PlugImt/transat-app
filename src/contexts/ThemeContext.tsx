import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { type ColorSchemeName, useColorScheme } from "react-native";
import { storage } from "@/services/storage/asyncStorage";
import STORAGE_KEYS from "@/services/storage/constants";
import colors from "@/themes/colors";

export type ThemeMode = "system" | "light" | "dark";

export type ThemeColorKeys = keyof ReturnType<typeof useTheme>["theme"];

export type ThemeType = {
  background: string;
  text: string;
  muted: string;
  textTertiary: string;
  card: string;
  primary: string;
  primaryText: string;
  secondary: string;
  secondaryText: string;
  border: string;
  backdrop: string;
  overlay: string;
  destructive: string;
  success: string;
  warning: string;
  input: string;
  destructiveText: string;
  destructiveBackground: string;
  successText: string;
  warningText: string;
  infoText: string;
};

type ThemeContextType = {
  theme: ThemeType;
  themeMode: ThemeMode;
  actualTheme: "light" | "dark";
  setThemeMode: (mode: ThemeMode) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>("system");

  // Determine the actual theme based on mode and system preference
  const getActualTheme = (
    mode: ThemeMode,
    systemScheme: ColorSchemeName,
  ): "light" | "dark" => {
    if (mode === "system") {
      return systemScheme === "light" ? "light" : "dark";
    }
    return mode as "light" | "dark";
  };

  const actualTheme = getActualTheme(themeMode, systemColorScheme);
  const themeColors = actualTheme === "dark" ? colors.dark : colors.light;

  // Add the shared colors to the theme
  const theme: ThemeType = {
    ...themeColors,
    destructive: colors.shared.destructive.DEFAULT,
    success: colors.shared.success.DEFAULT,
    warning: colors.shared.warning.DEFAULT,
    destructiveText: colors.shared.destructive.text,
    successText: colors.shared.success.text,
    warningText: colors.shared.warning.text,
    infoText: colors.shared.info.text,
    destructiveBackground: colors.shared.destructive.background,
    primary: colors.shared.primary.DEFAULT,
    primaryText: colors.shared.primary.text,
    secondary: colors.shared.secondary.DEFAULT,
    secondaryText: colors.shared.secondary.text,
  };

  // Load theme preference from storage on startup
  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const savedTheme = await storage.get<ThemeMode>(STORAGE_KEYS.THEME);
        if (savedTheme && ["system", "light", "dark"].includes(savedTheme)) {
          setThemeModeState(savedTheme);
        }
      } catch (error) {
        console.warn("Failed to load theme preference:", error);
      }
    };

    loadThemePreference().then((r) => r);
  }, []);

  // Save theme preference to storage
  const setThemeMode = async (mode: ThemeMode) => {
    try {
      setThemeModeState(mode);
      await storage.set(STORAGE_KEYS.THEME, mode);
    } catch (error) {
      console.warn("Failed to save theme preference:", error);
    }
  };

  const contextValue: ThemeContextType = {
    theme,
    themeMode,
    actualTheme,
    setThemeMode,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
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
