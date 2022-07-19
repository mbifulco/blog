import { Box } from '@chakra-ui/react';

const Vimeo = ({ vimeoId }) => {
  return (
    <>
      <Box
        as="iframe"
        src={`https://player.vimeo.com/video/${vimeoId}`}
        width="640"
        height="360"
        frameBorder="0"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
      />
    </>
  );
};

export default Vimeo;
