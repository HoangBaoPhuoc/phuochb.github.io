/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        dark: {
          DEFAULT: "#000000",
          100: "#0B1120",
          200: "#162032",
        },
      },
      fontFamily: {
        sans: ["Be Vietnam Pro", "sans-serif"],
        raleway: ["Be Vietnam Pro", "sans-serif"],
        gilroy: ["Be Vietnam Pro", "sans-serif"],
        "rouge-script": ["Rouge Script", "cursive"],
        "be-vietnam": ["Be Vietnam Pro", "sans-serif"],
        playfair: ["Playfair Display", "serif"],
      },
    },
  },
  plugins: [],
};
