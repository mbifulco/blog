import { Box, Link, SimpleGrid, Text, useTheme } from '@chakra-ui/react';
import NextLink from 'next/link';

import TagDictionary, { getTagInformation } from '../../data/ConvertKitTags';

const DEFAULT_TAGS_TO_DISPLAY = [
  'react',
  'remix',
  'next.js',
  'developer',
  'javascript',
  'design',
  'css',
  'ux',
  'tools',
  'productivity',
];

const RelatedContentLinksByTag = ({ tags = DEFAULT_TAGS_TO_DISPLAY }) => {
  const theme = useTheme();

  const pink = theme.colors.pink[600];

  return (
    <Box paddingTop="2rem" paddingBottom="5rem">
      <Text fontWeight="bold">More great resources</Text>
      <SimpleGrid fontSize="medium" minChildWidth="50%" spacingY="0.5rem">
        {tags.map((tag) => {
          const tagInformation = getTagInformation(tag);
          if (!tagInformation) return null;

          return (
            <Link
              textDecoration="underline"
              _hover={{
                textDecoration: 'none',
              }}
              as={NextLink}
              href={`/tags/${tag}`}
              key={`related-content-${tag}`}
            >
              {`Articles ${tagInformation.label}`}
            </Link>
          );
        })}
        <Link
          color={pink}
          _hover={{
            textDecoration: 'none',
          }}
          textDecoration="underline"
          href={`/tags`}
        >
          Browse all topics &rarr;
        </Link>
      </SimpleGrid>
    </Box>
  );
};

export default RelatedContentLinksByTag;
