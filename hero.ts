import { heroui } from "@heroui/theme";

export default heroui({
  themes: {
    light: {
      colors: {
        primary: {
          50: "#f0fff4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#00ff41",
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#14532d",
          DEFAULT: "#00ff41",
          foreground: "#000000",
        },
        background: {
          DEFAULT: "#ffffff",
        },
        foreground: {
          DEFAULT: "#000000",
        },
      },
    },
    dark: {
      colors: {
        primary: {
          50: "#14532d",
          100: "#166534",
          200: "#15803d",
          300: "#16a34a",
          400: "#4ade80",
          500: "#00ff41",
          600: "#86efac",
          700: "#bbf7d0",
          800: "#dcfce7",
          900: "#f0fff4",
          DEFAULT: "#00ff41",
          foreground: "#000000",
        },
        background: {
          DEFAULT: "#0a0a0a",
        },
        foreground: {
          DEFAULT: "#ffffff",
        },
      },
    },
  },
});
