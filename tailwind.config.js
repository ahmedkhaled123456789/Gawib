// const colors = require('tailwindcss/colors');
// const defaultColors = require('tailwindcss/colors');
// delete defaultColors.lightBlue;
// delete defaultColors.warmGray;
// delete defaultColors.trueGray;
// delete defaultColors.coolGray;
// delete defaultColors.blueGray;
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx,html}", "./index.html"],
  darkMode: ["selector", ".dark &:not(.light,.light *)"],
  // plugins: [require('@tailwindcss/forms')],
  theme: {
    extend: {
      colors: {
        primary: "#1f2937",
        secondary: "#111827",
        aqua: "#09b0cd",
        "dark-aqua": "#438394",
        "light-mode-gray": "#f3f4f6",
        danger: "#ff0f0f",
        transparent: "transparent",

        util: {
          hover: "#EBEEF3",
          danger: "#ff0f0f",
          success: "#22c55e",
          focus: "#ffa500",
        },
        green: {
          600: "#10AA3B",
        },
        blue: {
          600: "#9747FF",
        },
        gray: {
          50: "#ffffff",
          100: "#F7F7F7",
          300: "#EAEAEA",
          400: "#979797",
          500: "#909090",
          600: "#1F8194",
          900: "#333333",
          1000: "#000000",
        },
        // ...colors
      },
      fontFamily: {
        Cairo: [
          '"Cairo"',
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
          '"Noto Color Emoji"',
        ],
      },
      boxShadow: {
        card: "0px 4px 4px 0px #00000040",
        checkbox: "1px 2px 10.6px 0px #00000040 inset",
        grade: "0px 4px 4px 0px #00000040 inset",
        "grade-dark": "0px 4px 4px 0px #ffffff40 inset",
        "card-dark": "0px 4px 4px 0px #ffffff40",
      },
    },
  },
  plugins: [],
};
