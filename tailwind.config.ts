/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',

    // Or if using `src` directory:
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      extend: {
        colors: {
          pink: {
            '50': '#fdf2f8',
            '100': '#fbe8f2',
            '200': '#f9d1e6',
            '300': '#f6abd1',
            '400': '#ed64a6', // main theme pink
            default: '#ed64a6',
            '500': '#e64e93',
            '600': '#d42e71',
            '700': '#b81e58',
            '800': '#981c49',
            '900': '#7f1c40',
            '950': '#4d0a22',
          },
        },
      },
    },
  },
  plugins: [],
};
