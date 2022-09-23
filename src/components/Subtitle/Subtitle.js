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
      background={theme.colors.pink[500]}
      boxShadow="1px 1px 5px rgba(0, 0, 0, 0.8)"
      display={'inline-block'}
    >
      {children}
    </Text>
  );
};

export default Subtitle;
