import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        wikipediaGray: "#f6f6f6",
        wikipediaBlue: "#3366cc",
        wikipediaBlueDark: "#25487d",
      },
    },
  },
  plugins: [],
};
export default config;
