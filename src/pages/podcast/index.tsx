import Link from 'next/link';
import {
  Box,
  Heading,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
  Stack,
  Text,
} from '@chakra-ui/react';

import { NewsletterSignup } from '../../components/NewsletterSignup';
import SEO from '../../components/seo';
import { Subtitle } from '../../components/Subtitle';

const Eponymous = () => {
  return (
    <Popover trigger="hover">
      <PopoverTrigger>
        <span className="border-b border-dashed border-pink-400 cursor-pointer">
          eponymous
        </span>
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
          <Link className="text-pink-600 hover:underline" href="/newsletter">
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
