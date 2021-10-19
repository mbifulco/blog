import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';

import { Link as ChakraLink, Flex, Text, useTheme } from '@chakra-ui/react';

const Tag = ({ children, url }) => {
  const theme = useTheme();

  let tag = (
    <Flex marginRight="0.5rem">
      <Text color={theme.colors.gray[400]}>#</Text>
      <Text color={theme.colors.gray[700]}>{children}</Text>
    </Flex>
  );

  if (url) {
    tag = (
      <ChakraLink as={Link} href={url}>
        <a>{tag}</a>
      </ChakraLink>
    );
  }
  return tag;
};

Tag.propTypes = {
  children: PropTypes.node,
  url: PropTypes.string,
};

export default Tag;
