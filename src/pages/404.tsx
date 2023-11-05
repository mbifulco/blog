import React from 'react';

import { Heading, Link, Text, useTheme } from '@chakra-ui/react';

import { Image } from '../components/Image';
import SEO from '../components/seo';
import { NextPage } from 'next';

const NotFoundPage: NextPage = () => {
  const theme = useTheme();
  const pink = theme.colors.pink[600];

  return (
    <>
      <SEO title="404: URL Not found" />
      <Heading as="h1">Uh oh, you stumbled upon a bad URL.</Heading>
      <Image
        publicId="pawel-czerwinski-lWBZ01XRRoI-unsplash_fyoisl"
        alt="A soothing potted plant to atone for a missing page"
        caption={
          <span>
            Photo by{' '}
            <Link
              color={pink}
              href="https://unsplash.com/@pawel_czerwinski?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"
            >
              Pawel Czerwinski
            </Link>{' '}
            on{' '}
            <Link
              color={pink}
              href="https://unsplash.com/s/photos/plant?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"
            >
              Unsplash
            </Link>
          </span>
        }
      />
      <Text as="p">
        Hey, shit, sorry, this &mdash; {"isn't"} a page. If {"you're "}
        expecting something to be here,{' '}
        <Link color={pink} href="https://twitter.com/irreverentmike">
          tweet at me (@irreverentmike)
        </Link>{' '}
        and {"I'll"} do my best to help you out..
      </Text>
    </>
  );
};

export default NotFoundPage;
