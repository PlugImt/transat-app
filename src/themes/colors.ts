const sharedColors = {
  destructive: "#F44336",
  success: "#4CAF50",
  warning: "#FFC107",
  info: "#2196F3",

  primary: "#ec7f32",
  secondary: "#0049a8",
};

const colors = {
  light: {
    background: "#f5f4f2",
    text: "#1A1A1A",
    muted: "#6B7280",
    textTertiary: "#9CA3AF",
    foregroundPlaceholder: "#D1D5DB",
    card: "#FFFFFF",
    input: "#e3e3e3",
    border: "#E5E7EB",
    backdrop: "#7075810D",
    overlay: "#f5f4f2E5",

    primary: sharedColors.primary,
    secondary: sharedColors.secondary,
    errorBackground: `${sharedColors.destructive}20`, // 20% opacity (20 en hex = 12.5% en décimal)
  },
  dark: {
    background: "#070402",
    text: "#ffe6cc",
    muted: "#A1A1AA",
    textTertiary: "#71717A",
    foregroundPlaceholder: "#52525B",
    card: "#1e1515",
    input: "#2D2222A3",
    border: "#403D3D",
    backdrop: "#2C272666",
    overlay: "#070402E5",

    primary: sharedColors.primary,
    secondary: sharedColors.secondary,
    errorBackground: `${sharedColors.destructive}20`, // 20% opacity (20 en hex = 12.5% en décimal)
  },
  shared: {
    destructive: {
      DEFAULT: sharedColors.destructive,
      text: "#FFFFFF",
    },
    success: {
      DEFAULT: sharedColors.success,
      text: "#FFFFFF",
    },
    warning: {
      DEFAULT: sharedColors.warning,
      text: "#000000",
    },
    info: {
      DEFAULT: sharedColors.info,
      text: "#FFFFFF",
    },
  },
};

export default colors;
