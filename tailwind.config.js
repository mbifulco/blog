/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        pink: {
          50: '#ff96d8',
          100: '#ff8cce',
          200: '#ff82c4',
          300: '#ff78ba',
          400: '#f76eb0',
          500: '#ed64a6',
          600: '#e35a9c',
          700: '#d95092',
          800: '#cf4688',
          900: '#c53c7e',
        },
      },
    },
  },
  plugins: [],
};
