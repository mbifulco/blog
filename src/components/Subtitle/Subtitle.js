import { Text, useTheme } from '@chakra-ui/react';

const Subtitle = ({ as = 'span', children }) => {
  const theme = useTheme();
  return (
    <Text
      as={as}
      padding="0.25ch 1.5ch"
      borderRadius={'40px'}
      className="tagline"
      fontSize={'sm'}
      textTransform="uppercase"
      color={theme.colors.white}
      background={theme.colors.pink[400]}
      display={'inline-block'}
    >
      {children}
    </Text>
  );
};

export default Subtitle;
