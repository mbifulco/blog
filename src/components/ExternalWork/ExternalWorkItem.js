import { Box, Heading, Stack, Text, useTheme } from '@chakra-ui/react';
import { MDXRemote } from 'next-mdx-remote';

import { PublishDate } from '../PublishDate';

import { components } from '../../utils/MDXProviderWrapper';
import TagsSummary from '../tagsSummary';

const ExternalWorkItem = ({ article, border = false }) => {
  const theme = useTheme();

  const {
    frontmatter: { date, url, title, tags },
  } = article;

  {
    /* note: box shadow from @drucial's https://www.betterneumorphism.com/?h=0&s=0&l=100 */
  }
  return (
    <Box
      as="article"
      boxShadow={`8px 8px 20px hsl(0, 0%, 80%), -8px -7px 20px hsl(0, 0%, 120%), inset -0.2px -0.2px 0.8px hsl(0, 0%, 80%), inset 0.2px 0.2px 0.8px hsl(0, 0%, 120%);`}
      padding={'1.5rem 1rem 2rem 1rem'}
      borderRadius="20px"
    >
      <Stack>
        <Stack>
          <Heading marginBottom="0" fontSize="2rem" as="h2" key={url}>
            {title}
          </Heading>
          <Text marginTop={0} color={theme.colors.pink[500]}>
            <PublishDate date={date} />
          </Text>
          <TagsSummary tags={tags} />
          <MDXRemote {...article.source} components={components} />
        </Stack>
      </Stack>
    </Box>
  );
};

export default ExternalWorkItem;
