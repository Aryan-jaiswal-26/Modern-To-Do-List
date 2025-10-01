import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./node_modules/@headlessui/react/dist/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#6366f1",
          foreground: "#ffffff"
        },
        accent: {
          DEFAULT: "#22d3ee"
        }
      }
    }
  },
  plugins: [require("@tailwindcss/forms")]
};

export default config;
