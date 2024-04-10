/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // ... your color definitions
      },
      fontFamily: {
        futura: ['Futura', 'Trebuchet MS', 'Arial', 'sans-serif'], // Custom Futura font
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            'h1, h2, h3, h4, h5, h6': {
              fontFamily: `${theme('fontFamily.futura')}`,
            },
          },
        },
      }),
    },
  },
  plugins: ['@tailwindcss/typography'],
};
