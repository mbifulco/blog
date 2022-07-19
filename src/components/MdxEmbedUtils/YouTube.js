import { Box } from '@chakra-ui/react';

const YouTube = ({ youTubeId }) => {
  // h/t to https://avexdesigns.com/blog/responsive-youtube-embed for CSS rules
  // used for dynamic size
  return (
    <Box
      position={'relative'}
      paddingBottom="56.26%"
      paddingTop="30px"
      height="0"
      overflow={'hidden'}
    >
      <Box
        as="iframe"
        id="ytplayer"
        type="text/html"
        position={'absolute'}
        top="0"
        left="0"
        width="100%"
        height="100%"
        src={`https://www.youtube.com/embed/${youTubeId}?autoplay=0&origin=http://mikebifulco.com`}
        frameBorder="0"
      />
    </Box>
  );
};

export default YouTube;
