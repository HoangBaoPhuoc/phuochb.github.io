/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
            DEFAULT: '#000000',
            100: '#0B1120',
            200: '#162032',
        }
      },
      fontFamily: {
        raleway: ['Outfit', 'sans-serif'],
        gilroy: ['Outfit', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
