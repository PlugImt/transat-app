import heroUINativePlugin from "heroui-native/tailwind-plugin";

const colors = require("./src/themes/colors").default;

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/heroui-native/lib/**/*.{js,ts,jsx,tsx}",
  ],
  plugins: [heroUINativePlugin],
  presets: [require("nativewind/preset")],
  theme: {
    fontFamily: {
      sans: ["Poppins", "sans-serif"],
    },
    extend: {
      colors: {
        // Light theme colors (default)
        border: colors.light.muted,
        input: colors.light.input,
        background: colors.light.background,
        foreground: colors.light.text,
        primary: {
          DEFAULT: colors.light.primary,
          foreground: colors.light.text,
        },
        secondary: {
          DEFAULT: colors.light.secondary,
          foreground: colors.light.text,
        },
        card: {
          DEFAULT: colors.light.card,
          foreground: colors.light.text,
        },
        lightCard: {
          DEFAULT: colors.light.card,
          foreground: colors.light.text,
        },
        ...colors.shared,
        muted: {
          DEFAULT: colors.light.muted,
          foreground: colors.light.muted,
        },
      },
      borderRadius: {
        sm: "4px",
        md: "8px",
        lg: "12px",
        xl: "16px",
      },
    },
  },
};
