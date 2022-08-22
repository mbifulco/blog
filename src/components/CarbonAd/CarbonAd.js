import { Box } from '@chakra-ui/react';
import Script from 'next/script';

const CarbonAd = () => {
  return (
    <Box>
      <Script
        async
        type="text/javascript"
        src="https://cdn.carbonads.com/carbon.js?serve=CESI553Y&placement=mikebifulcocom"
        id="_carbonads_js"
      />
      <Box id="carbonads" />
    </Box>
  );
};

export default CarbonAd;
