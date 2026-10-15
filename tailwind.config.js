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
      fontFamily: {
        futura: ['Futura', 'var(--font-jost)', 'Trebuchet MS', 'Arial', 'sans-serif'],
        serif: ['var(--font-source-serif)', 'Georgia', 'serif'],
        quickdraw: ['var(--font-quickdraw)'],
        dumpling: ['var(--font-dumpling)'],
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            h1: {
              fontFamily: `${theme('fontFamily.dumpling')}`,
              marginTop: '1.75em',
              marginBottom: '0.35em',
            },
            h2: {
              fontFamily: `${theme('fontFamily.dumpling')}`,
              marginTop: '1.75em',
              marginBottom: '0.35em',
            },
            h3: {
              fontFamily: `${theme('fontFamily.dumpling')}`,
              marginTop: '1.4em',
              marginBottom: '0.3em',
            },
            h4: {
              fontFamily: `${theme('fontFamily.dumpling')}`,
              marginTop: '1.25em',
              marginBottom: '0.25em',
            },
            h5: {
              fontFamily: `${theme('fontFamily.dumpling')}`,
              marginTop: '1.25em',
              marginBottom: '0.2em',
            },
            h6: {
              fontFamily: `${theme('fontFamily.dumpling')}`,
              marginTop: '1.25em',
              marginBottom: '0.2em',
            },
            p: {
              marginTop: '0',
            },
            pre: {
              marginTop: '0',
              marginBottom: '0',
            },
            'code::before': { content: 'none' },
            'code::after': { content: 'none' },
          },
        },
      }),
    },
  },
  plugins: [require('@tailwindcss/typography'), require('tailwindcss-animate')],
};
