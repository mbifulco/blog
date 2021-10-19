import Image from 'next/image';
import Link from 'next/link';
import { Box, Stack, Heading, Spacer, Text, useTheme } from '@chakra-ui/react';
import { MDXRemote } from 'next-mdx-remote';
import moment from 'moment';
import TagsSummary from '../tagsSummary';

const ExternalWorkFeed = ({ articles }) => {
  const theme = useTheme();

  return articles.map((article) => {
    const {
      frontmatter: { date, url, title, tags },
    } = article;

    const formattedDate = moment(new Date(date)).format('MMMM DD, YYYY');
    return (
      <Box
        key={url}
        boxShadow={'0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)'}
        padding="1.5rem 2rem 2rem 2rem"
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
  });
};

export default ExternalWorkFeed;
