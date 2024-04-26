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
        custom: {
          white: "#FDFFFC",
          light: "#D6D9EC",
          grey: "#888DA7",
        },
      },
    },
  },
  plugins: [],
};
export default config;
