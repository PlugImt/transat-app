const colors = require("./src/themes/colors").default;

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
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
        foreground: colors.light.foreground,
        primary: {
          DEFAULT: colors.light.primary,
          foreground: colors.light.foreground,
        },
        secondary: {
          DEFAULT: colors.light.secondary,
          foreground: colors.light.foreground,
        },
        card: {
          DEFAULT: colors.light.card,
          foreground: colors.light.foreground,
        },
        lightCard: {
          DEFAULT: colors.light.card,
          foreground: colors.light.foreground,
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
