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
        border: colors.dark.muted,
        input: colors.dark.input,
        background: colors.dark.background,
        foreground: colors.dark.foreground,
        primary: {
          DEFAULT: colors.dark.primary,
          foreground: colors.dark.foreground,
        },
        secondary: {
          DEFAULT: colors.dark.secondary,
          foreground: "#95b5df",
        },
        card: {
          DEFAULT: colors.dark.card,
          foreground: colors.dark.foreground,
        },
        lightCard: {
          DEFAULT: "#1e1515",
          foreground: colors.dark.foreground,
        },
        ...colors.shared,
        muted: {
          DEFAULT: colors.dark.muted,
          foreground: "#8A8A8A",
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
