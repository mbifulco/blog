/* eslint-disable max-len */
import React from 'react';
import PropTypes from 'prop-types';

import { Image as Img } from '@chakra-ui/react';
import { useImage } from 'use-cloudinary';

function Image(props) {
  const { publicId, transformations, width, height, alt, caption } = props;
  const { generateUrl, url, status, error } = useImage({
    cloudName: process.env.GATSBY_CLOUDINARY_CLOUD_NAME,
  });

  React.useEffect(() => {
    // the `generateUrl` function will hook internally to the SDK and do a lot of the heavy lifting for generating your image url
    generateUrl({
      publicId,
      transformations: {
        // by supplying height and width separately from the transformations object,
        // we can use the height and width to dictate the size of the element AND the transformations
        height,
        width,
        // then we can spread the rest of the transformations in
        ...transformations,

        /* 
          you'll also be getting these automatically attached from internals

          fetchFormat: 'auto',
          quality: 'auto',
          crop: 'scale'

        */
      },
    });
  }, [publicId, height, width, transformations]);

  // status can either be "success", "loading", or "error"
  if (status === 'loading') return <p>Loading...</p>;

  // we can check if the status of our request is an error, and surface that error to our UI
  if (status === 'error') return <p>{error.message}</p>;

  return (
    <figure>
      <Img
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...props}
        // we also have changed `data` to `url` to better describe what `generateUrl` gives us back and makes more sense to pass to `src`
        styles={{
          width,
          height,
        }}
        src={url}
        alt={alt}
      />
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}

Image.propTypes = {
  caption: PropTypes.oneOf([PropTypes.string, PropTypes.node]),
  publicId: PropTypes.string,
  transformations: PropTypes.arrayOf(PropTypes.string),
  width: PropTypes.string,
  height: PropTypes.string,
  alt: PropTypes.string,
};

export default Image;
