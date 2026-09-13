import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          red: "#E11D48",
          redDark: "#BE123C",
          redLight: "#FFE4E6",
          blue: "#0284C7",
          blueDark: "#0369A1",
          blueLight: "#E0F2FE",
          surface: "#FAFAF9",
          border: "#E7E5E4",
        },
      },
    },
  },
  plugins: [],
};

export default config;
