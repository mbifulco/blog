import Link from 'next/link';
import { Box, Heading, Text, Stack, useColorModeValue } from '@chakra-ui/react';

import { Image } from '..';
import TagsSummary from '../tagsSummary';
import formatDate from '../../utils/format-date';
import { getCloudinaryImageUrl } from '../../utils/images';

const NewsletterItem = ({ newsletter, as = 'h3' }) => {
  const { coverImagePublicId, date, excerpt, slug, tags, title } =
    newsletter.frontmatter;

  return (
    <Box
      maxW={'445px'}
      w={'full'}
      bg={useColorModeValue('white', 'gray.900')}
      boxShadow={'2xl'}
      rounded={'md'}
      p={6}
      overflow={'hidden'}
    >
      <Link href={`/newsletter/${slug}`}>
        <Box
          h={'210px'}
          bg={'gray.100'}
          mt={-6}
          mx={-6}
          mb={6}
          pos={'relative'}
          backgroundImage={getCloudinaryImageUrl(coverImagePublicId)}
          backgroundSize="cover"
        />
      </Link>
      <Stack>
        <Text
          color={'pink.600'}
          textTransform={'uppercase'}
          fontWeight={700}
          fontSize={'sm'}
        >
          📰 {formatDate(date)}
        </Text>
        <Heading
          color={useColorModeValue('gray.700', 'white')}
          fontSize={'xl'}
          fontFamily={'body'}
          as={as}
          height="2.5em"
        >
          <Link href={`/newsletter/${slug}`}>{title}</Link>
        </Heading>
        <Text
          color={'gray.500'}
          height="6rem"
          overflowY={'hidden'}
          textOverflow="ellipsis"
        >
          {excerpt}
        </Text>
      </Stack>
      <Stack mt={6} direction={'row'} spacing={4} align={'center'}>
        <Stack direction={'column'} spacing={0} fontSize={'sm'}>
          <TagsSummary tags={tags} />
        </Stack>
      </Stack>
    </Box>
  );
};

export default NewsletterItem;
