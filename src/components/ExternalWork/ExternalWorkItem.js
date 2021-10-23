import { Box, Heading, Stack, Text, useTheme } from '@chakra-ui/react';
import { MDXRemote } from 'next-mdx-remote';
import dayjs from 'dayjs';

import TagsSummary from '../tagsSummary';

const ExternalWorkItem = ({ article, border = false }) => {
  const theme = useTheme();

  const {
    frontmatter: { date, url, title, tags },
  } = article;

  const formattedDate = dayjs(new Date(date)).format('MMMM DD, YYYY');
  return (
    <Box
      key={url}
      boxShadow={
        !!border
          ? '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)'
          : null
      }
      padding={!!border ? '1.5rem 1rem 2rem 1rem' : null}
      borderRadius="20px"
      marginBottom="2rem"
    >
      <Stack>
        <Stack>
          <Heading marginBottom="0" fontSize="2rem" as="h2" key={url}>
            {title}
          </Heading>
          <Text marginTop={0} color={theme.colors.pink[500]}>
            {formattedDate}
          </Text>
          <TagsSummary tags={tags} />
          <MDXRemote {...article.source} />
        </Stack>
      </Stack>
    </Box>
  );
};

export default ExternalWorkItem;
