import { Flex, SimpleGrid, Stack, theme, useTheme } from '@chakra-ui/react';

const Colophon = () => {
  const theme = useTheme();
  return (
    <SimpleGrid columns="3">
      <span />
      <Flex
        justifyContent={'space-evenly'}
        fontSize={'6xl'}
        color={theme.colors.pink[500]}
      >
        <span>*</span>
        <span>*</span>
        <span>*</span>
      </Flex>
      <span />
    </SimpleGrid>
  );
};

export default Colophon;
