/** @type {import('tailwindcss').Config} */
export const content = [
  "./index.html",
  "./src/**/*.{js,ts,jsx,tsx}",
];
export const theme = {
  extend: {
    fontFamily: {
      sans: ["Inter", "sans-serif"], // Optional: Add a clean font
    },
  },
};
export const darkMode = "class";
export const plugins = [];
