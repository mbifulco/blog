import Script from 'next/script';

const CarbonAd = () => {
  return (
    <Script
      async
      type="text/javascript"
      src="//cdn.carbonads.com/carbon.js?serve=CESI553Y&placement=mikebifulcocom"
      id="_carbonads_js"
    />
  );
};

export default CarbonAd;
