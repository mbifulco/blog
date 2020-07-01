import { theme } from '@chakra-ui/core';
// Let's say you want to add custom colors
const customTheme = {
  ...theme,
  colors: {
    ...theme.colors,
    pink: {
      50: '#ffe3ed',
      100: '#ffb1ca',
      200: '#ff7fa7',
      300: '#fe4e84',
      400: '#fd1e60',
      500: '#e30747',
      600: '#b10137',
      700: '#800027',
      800: '#4e0017',
      900: '#1f0008',
    },
  },
};

export default customTheme;
