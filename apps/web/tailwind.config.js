/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: "#F5F0E6",
          dark: "#EBE4D6",
        },
        ink: {
          DEFAULT: "#1A1A1A",
          muted: "#4A4A4A",
          light: "#888888",
        },
        brand: {
          red: "#E04533",
          "red-dark": "#C73A2A",
          green: "#2D6A4F",
          "green-light": "#40916C",
          "green-dark": "#1B4332",
          gold: "#C9A227",
        },
        pitch: {
          light: "#52B788",
          DEFAULT: "#2D6A4F",
          dark: "#1B4332",
          stripe: "#40916C",
        },
      },
      fontFamily: {
        display: ["Bebas Neue", "Impact", "sans-serif"],
        condensed: ["Oswald", "Arial Narrow", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"],
        mono: ["IBM Plex Mono", "monospace"],
      },
      boxShadow: {
        retro: "0 4px 0 0 #1A1A1A",
        "retro-sm": "0 2px 0 0 #1A1A1A",
        "retro-red": "0 4px 0 0 #8B2518",
      },
    },
  },
  plugins: [],
};
