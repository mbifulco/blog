import Link from 'next/link';
import {
  Box,
  Center,
  Heading,
  Text,
  Stack,
  Avatar,
  useColorModeValue,
} from '@chakra-ui/react';

import { Image } from '..';
import TagsSummary from '../tagsSummary';
import formatDate from '../../utils/format-date';

const NewsletterItem = ({ newsletter, as = 'h3' }) => {
  const { coverImagePublicId, date, excerpt, slug, tags, title } =
    newsletter.frontmatter;

  return (
    <Center py={6}>
      <Box
        maxW={'445px'}
        w={'full'}
        bg={useColorModeValue('white', 'gray.900')}
        boxShadow={'2xl'}
        rounded={'md'}
        p={6}
        overflow={'hidden'}
      >
        <Box
          h={'210px'}
          bg={'gray.100'}
          mt={-6}
          mx={-6}
          mb={6}
          pos={'relative'}
        >
          <Link href={`/newsletter/${slug}`}>
            <Image
              publicId={coverImagePublicId}
              alt={`Cover image for newsletter ${title}`}
              maxHeight="210px"
              height="210px"
              width="400px"
              layout="fill"
            />
          </Link>
        </Box>
        <Stack>
          <Text
            color={'pink.500'}
            textTransform={'uppercase'}
            fontWeight={800}
            fontSize={'sm'}
          >
            📰 {formatDate(date)}
          </Text>
          <Heading
            color={useColorModeValue('gray.700', 'white')}
            fontSize={'xl'}
            fontFamily={'body'}
            as={as}
          >
            <Link href={`/newsletter/${slug}`}>{title}</Link>
          </Heading>
          <Text color={'gray.500'}>{excerpt}</Text>
        </Stack>
        <Stack mt={6} direction={'row'} spacing={4} align={'center'}>
          <Stack direction={'column'} spacing={0} fontSize={'sm'}>
            <TagsSummary tags={tags} />
            <Link href={`/newsletter/${slug}`} color={'gray.600'}>
              6min read
            </Link>
          </Stack>
        </Stack>
      </Box>
    </Center>
  );
};

export default NewsletterItem;
