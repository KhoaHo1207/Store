/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: [
    "./App.tsx",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./screens/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#FF8008",
          light: "#FFA63B",
          dark: "#CC6606",
        },
        secondary: "#FFC837",
        third: "#FFEEA9",
        background: "#FFF8E7",
        text: {
          primary: "#2C2C2C",
          secondary: "#555555",
          light: "#FFFFFF",
        },
      },
    },
  },
  plugins: [],
};
