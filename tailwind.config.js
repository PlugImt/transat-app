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
        border: "#2A2A2A",
        input: "#2A2A2A",
        background: "#110904",
        foreground: "#ffe6cc",
        primary: {
          DEFAULT: "#ec7f32",
          foreground: "#ffe6cc",
        },
        secondary: {
          DEFAULT: "#0049a8",
          foreground: "#95b5df",
        },
        destructive: {
          DEFAULT: "#F44336",
          foreground: "#FFFFFF",
        },
        success: {
          DEFAULT: "#4CAF50",
          foreground: "#FFFFFF",
        },
        warning: {
          DEFAULT: "#FFC107",
          foreground: "#000000",
        },
        info: {
          DEFAULT: "#2196F3",
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "#494949",
          foreground: "#8A8A8A",
        },
        card: {
          DEFAULT: "#181010",
          foreground: "#ffe6cc",
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
