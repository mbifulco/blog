import { extendTheme } from '@chakra-ui/react';
// Let's say you want to add custom colors

// eslint-disable-next-line max-len
const fontDefs = `'Inter UI', -apple-system, BlinkMacSystemFont, 'Roboto', 'Segoe UI', Helvetica, Arial, sans-serif, 'apple color emoji', 'segoe ui emoji', 'android emoji', 'emojisymbols', 'emojione mozilla', 'twemoji mozilla', 'segoe ui symbol', 'noto color emoji'`;

const customTheme = {
  initialColorMode: 'light',
  useSystemColorMode: false,
  fonts: {
    body: fontDefs,
    heading: fontDefs,
    mono: 'Menlo, monospace',
  },
  colors: {
    pink: {
      50: '#ffe3ed',
      100: '#ffb1ca',
      200: '#ff7fa7',
      300: '#fe4e84',
      400: '#e40043',
      500: '#e30747',
      600: '#b10137',
      700: '#800027',
      800: '#4e0017',
      900: '#1f0008',
    },
  },
};

export default extendTheme(customTheme);
