const sharedColors = {
  destructive: "#F44336",
  success: "#4CAF50",
  warning: "#FFC107",
  info: "#2196F3",

  primary: "#ec7f32",
  secondary: "#0049a8",

  blueFigmaLight: "#0049A8", 
  blueFigmaDark: "#4D94FF",
  greenFigma: "#4CAF50",
};

const colors = {
  light: {
    background: "#f5f4f2",
    text: "#1A1A1A",
    muted: "#6B7280",
    textTertiary: "#9CA3AF",
    card: "#FFFFFF",
    input: "#e3e3e3",
    border: "#E5E7EB",
    backdrop: "#70758166",
    overlay: "#f5f4f2E5",
    covoitShopping: {
      color: sharedColors.blueFigmaLight,
      background: `${sharedColors.blueFigmaLight}1A`,
    }
  },
  dark: {
    background: "#070402",
    text: "#ffe6cc",
    muted: "#A1A1AA",
    textTertiary: "#71717A",
    card: "#1e1515",
    input: "#2D2222A3",
    border: "#403D3D",
    backdrop: "#000000CC",
    overlay: "#070402E5",
    covoitShopping: {
      color: sharedColors.blueFigmaDark,
      background: `${sharedColors.blueFigmaDark}26`,
    }
  },
  shared: {
    primary: {
      DEFAULT: sharedColors.primary,
      text: "#FFFFFF",
    },
    secondary: {
      DEFAULT: sharedColors.secondary,
      text: "#FFFFFF",
    },
    destructive: {
      DEFAULT: sharedColors.destructive,
      text: "#FFFFFF",
      background: `${sharedColors.destructive}20`, // 20% opacity (20 en hex = 12.5% en décimal)
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
    covoitTags: {
      shopping: {
        color: sharedColors.blueFigmaDark,
        background: `${sharedColors.blueFigmaDark}1A`,
      },
      long_trip: {
        color: sharedColors.primary,
        background: `${sharedColors.primary}1A`,
      },
      other: {
        color: sharedColors.greenFigma,
        background: `${sharedColors.greenFigma}1A`,
      },
    },
  },
};

export default colors;
