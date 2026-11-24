/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', "sans-serif"],
      },
      colors: {
        canvas: "#F4F3EE", // page background
        ink: "#141414", // main text, sidebar, dark card
        accent: "#7C6CD8",
        // soft tiles for highlighted numbers
        lavender: "#E6E0F8",
        mint: "#DCEFDF",
        cream: "#F7F0D2",
        blush: "#F9DCE7",
        sky: "#D9E8F8",
      },
    },
  },
  plugins: [],
};
