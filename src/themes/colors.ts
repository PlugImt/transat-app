import type { ThemeType } from "@/contexts/ThemeContext";

type SharedColors = Pick<ThemeType, "destructive" | "success" | "warning">;
type SpecificColors = Omit<ThemeType, keyof SharedColors>;

const colors = {
  light: {
    background: "#FFFFFF",
    text: "#1A1A1A",
    textSecondary: "#6B7280",
    textTertiary: "#9CA3AF",
    foregroundPlaceholder: "#D1D5DB",
    card: "#f5f4f2",
    input: "#e3e3e3",
    primary: "#ec7f32",
    secondary: "#0049a8",
    muted: "#6B7280",
    border: "#E5E7EB",
    backdrop: "rgba(112,117,129,0.05)",
    overlay: "#FFFFFFE5",
    errorBackground: "#F4433620",
    onSurface: "#d1d5db",
  } satisfies SpecificColors,
  dark: {
    background: "#070402",
    text: "#ffe6cc",
    textSecondary: "#A1A1AA",
    textTertiary: "#71717A",
    foregroundPlaceholder: "#52525B",
    card: "#1e1515",
    input: "rgba(45,34,34,0.64)",
    primary: "#ec7f32",
    secondary: "#0049a8",
    muted: "#494949",
    border: "#374151",
    backdrop: "rgba(44,39,38,0.4)",
    overlay: "#070402E5",
    errorBackground: "#F4433620",
    onSurface: "#1e1515",
  } satisfies SpecificColors,
  shared: {
    destructive: {
      DEFAULT: "#F44336",
      text: "#FFFFFF",
    },
    success: {
      DEFAULT: "#4CAF50",
      text: "#FFFFFF",
    },
    warning: {
      DEFAULT: "#FFC107",
      text: "#000000",
    },
    info: {
      DEFAULT: "#2196F3",
      text: "#FFFFFF",
    },
  },
};

export default colors;
