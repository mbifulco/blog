import NextLink from 'next/link';
import { Box, Link, Stack, Text, useTheme } from '@chakra-ui/react';

import { Image } from '../Image';

const SponsoredSection = ({
  children,
  CTAtext,
  sponsorName,
  href,
  imagePublicId,
}) => {
  const theme = useTheme();

  const displayBar = {
    content: '" "',
    display: 'block',
    height: '3px',
    width: '33%',
    background: theme.colors.pink[400],
    position: 'relative',
    marginLeft: 'auto',
    marginRight: 'auto',
  };

  return (
    <Box overflowX={['hidden', 'hidden', 'visible']}>
      <Box
        as="section"
        className="sponsored-section"
        border={`1px solid ${theme.colors.gray[300]}`}
        borderRadius="sm"
        margin="1em -2em"
        padding="1em 2em"
        _before={{
          ...displayBar,
          top: 'calc(-1em - 3px)',
        }}
        _after={{
          ...displayBar,
          bottom: 'calc(-1em - 3px)',
        }}
        fontSize="md"
      >
        <Link
          as={NextLink}
          className="thank-you"
          href="/sponsor"
          target="_blank"
          textTransform={'uppercase'}
          textColor={theme.colors.gray[500]}
          fontSize="sm"
          display={'block'}
          marginBottom="1ch"
        >
          Thanks to our sponsor
        </Link>
        {imagePublicId && (
          <Link as={NextLink} href={href} target="_blank">
            <Image
              publicId={imagePublicId}
              alt={`Sponsored by ${sponsorName}`}
            />
          </Link>
        )}

        {children}

        <Stack alignContent="center">
          <Link href={href} as={NextLink} color="pink.500" alignSelf={'center'}>
            {CTAtext}
          </Link>
        </Stack>
      </Box>
    </Box>
  );
};

export default SponsoredSection;
