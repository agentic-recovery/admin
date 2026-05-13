import type { Config } from "tailwindcss";
const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./context/**/*.{ts,tsx}", "./store/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Plus Jakarta Sans'","sans-serif"],
        body:    ["'Outfit'","sans-serif"],
        mono:    ["'IBM Plex Mono'","monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
