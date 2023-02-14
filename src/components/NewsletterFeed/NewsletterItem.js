import Link from 'next/link';
import { Box, Heading, Text, Stack, useColorModeValue } from '@chakra-ui/react';

import TagsSummary from '../tagsSummary';
import formatDate from '../../utils/format-date';
import { getCloudinaryImageUrl } from '../../utils/images';

const NewsletterItem = ({ newsletter, as = 'h3', compact = false }) => {
  const { coverImagePublicId, date, excerpt, slug, tags, title } =
    newsletter.frontmatter;

  return (
    <Box
      w={'full'}
      bg={useColorModeValue('white', 'gray.900')}
      overflow={'hidden'}
    >
      <Link
        href={`/newsletter/${slug}`}
        style={{ display: 'block', aspectRatio: '1200/670', margin: '0' }}
      >
        <Box
          bg={'gray.100'}
          minH={'205px'}
          height="100%"
          backgroundImage={getCloudinaryImageUrl(coverImagePublicId)}
          backgroundSize="cover"
          style={{ aspectRatio: '1200/630' }}
        />
      </Link>
      <Stack mt={4}>
        <Heading color={'pink.600'} fontSize={'xl'} fontFamily={'body'} as={as}>
          <Link href={`/newsletter/${slug}`}>{title}</Link>
        </Heading>
        {!compact && (
          <Text textTransform={'uppercase'} fontSize={'sm'} color="gray.500">
            {formatDate(date)}
          </Text>
        )}
        <Text
          color={'gray.600'}
          noOfLines={3}
          overflowY={'hidden'}
          textOverflow="ellipsis"
        >
          {excerpt}
        </Text>
      </Stack>
      {!compact && (
        <Stack mt={6} direction={'row'} spacing={4} align={'center'}>
          <Stack direction={'column'} spacing={0} fontSize={'sm'}>
            <TagsSummary tags={tags} />
          </Stack>
        </Stack>
      )}
    </Box>
  );
};

export default NewsletterItem;
