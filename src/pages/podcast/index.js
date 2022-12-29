import NextLink from 'next/link';
import {
  Box,
  Heading,
  Link,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  PopoverAnchor,
  Stack,
  Text,
  useTheme,
} from '@chakra-ui/react';

import { NewsletterSignup } from '../../components/NewsletterSignup';
import SEO from '../../components/seo';
import { Subtitle } from '../../components/Subtitle';

const Eponymous = () => {
  const theme = useTheme();
  return (
    <Popover trigger="hover">
      <PopoverTrigger>
        <Text
          as="span"
          borderBottom={`${theme.colors.pink[400]} 1px dashed`}
          cursor="pointer"
        >
          eponymous
        </Text>
      </PopoverTrigger>
      <PopoverContent boxShadow="lg">
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverHeader>
          <dl>
            <dt style={{ fontWeight: 600 }}>e·pon·y·mous</dt>{' '}
            <dd>
              <small>
                <em>adj.</em>- of or having the same name.
              </small>{' '}
            </dd>
          </dl>
        </PopoverHeader>
        <PopoverBody fontSize={'sm'}>
          {"That's"} right, my newsletter is also called{' '}
          <em>Tiny Improvements</em>. Sound interesting? Check it out{' '}
          <Link color="pink.400" href="/newsletter">
            here
          </Link>
          .
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

const PodcastPage = () => {
  return (
    <>
      <SEO
        title="Subscribe to Tiny Improvements: articles software dev, design, and climate"
        image={
          'https://res.cloudinary.com/mikebifulco-com/image/upload/v1662476730/newsletters/cover.png'
        }
      />

      <Stack>
        <Box as="header">
          <Heading as="h1">Tiny Improvements</Heading>
          <Subtitle>🎙️ The Podcast</Subtitle>
        </Box>
        <Text fontSize={'xl'}>
          Occasionally, {"I'll"} write something I like <em>so much</em> that I
          record it as a podcast. Think of them short-form audio essays,
          published under the same title as my <Eponymous />{' '}
          <Link color="pink.400" as={NextLink} href="/newsletter">
            newsletter
          </Link>
          .
        </Text>
      </Stack>

      <Stack direction={'column'} spacing={'0'}>
        <iframe
          width="100%"
          height="390"
          frameBorder="no"
          scrolling="no"
          seamless
          src="https://share.transistor.fm/e/tiny-improvements/playlist"
        ></iframe>
      </Stack>

      <NewsletterSignup />
    </>
  );
};

export default PodcastPage;
