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
      gridTemplateColumns: {
        'auto-fit-min-300': 'repeat(auto-fit, minmax(300px, 1fr))',
      },
      colors: {
        // ... your color definitions
      },
      fontFamily: {
        futura: ['Futura', 'Trebuchet MS', 'Arial', 'sans-serif'], // Custom Futura font
        quickdraw: ['var(--font-quickdraw)'],
        dumpling: ['var(--font-dumpling)'],
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            h1: {
              fontFamily: `${theme('fontFamily.dumpling')}`,
            },
            h2: {
              fontFamily: `${theme('fontFamily.dumpling')}`,
            },
            h3: {
              fontFamily: `${theme('fontFamily.dumpling')}`,
            },
            h4: {
              fontFamily: `${theme('fontFamily.dumpling')}`,
            },
            h5: {
              fontFamily: `${theme('fontFamily.dumpling')}`,
            },
            h6: {
              fontFamily: `${theme('fontFamily.dumpling')}`,
            },
          },
        },
      }),
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
