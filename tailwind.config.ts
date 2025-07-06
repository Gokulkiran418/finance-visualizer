import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme"; // Corrected import for defaultTheme

const config: Config = {
  darkMode: "class", // Optional: enables dark mode via class strategy
  content: [
    "./app/**/*.{ts,tsx}",
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./sections/**/*.{ts,tsx}",
    "./node_modules/@shadcn/ui/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Access fontFamily from defaultTheme object
        sans: ["var(--font-sans)", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        // Optional: override or extend Tailwind colors
        primary: "#2563eb",
        secondary: "#9333ea",
      },
      animation: {
        fadeIn: "fadeIn 0.5s ease-out forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0, transform: "translateY(10px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;