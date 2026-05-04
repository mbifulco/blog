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
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
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
  plugins: [require('@tailwindcss/typography'), require("tailwindcss-animate")],
};
