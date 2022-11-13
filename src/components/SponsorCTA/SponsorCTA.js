import { Text, Link, useTheme } from '@chakra-ui/react';

const SponsorCTA = () => {
  const theme = useTheme();

  return (
    <Text>
      <span role="img" aria-hidden>
        🎟️
      </span>{' '}
      Interested in sponsoring? &rarr;{' '}
      <Link
        color={theme.colors.pink[400]}
        display="inline"
        fontWeight={600}
        href="/sponsor"
        target="_blank"
        rel="noopener noreferrer"
      >
        Click here
      </Link>
    </Text>
  );
};

export default SponsorCTA;
