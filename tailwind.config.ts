import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#000000", // black
        header: "#F5F5DC", // beige
        text: {
          primary: "#FFFFFF", // white
          secondary: "#000000", // black
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
