/* eslint-disable max-len */
import React from 'react';
import PropTypes from 'prop-types';

import { Image as Img } from '@chakra-ui/react';
import { useImage } from 'use-cloudinary';

function Image(props) {
  const {
    publicId,
    transformations,
    width,
    height,
    alt,
    caption,
    ...rest
  } = props;
  const { generateImageUrl } = useImage(
    process.env.GATSBY_CLOUDINARY_CLOUD_NAME
  );

  const cloudinaryConfig = {
    delivery: {
      publicId,
    },
    transformations,
  };

  const url = generateImageUrl(cloudinaryConfig);

  return (
    <figure>
      <Img
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...rest}
        // we also have changed `data` to `url` to better describe what `generateUrl` gives us back and makes more sense to pass to `src`
        height={height}
        width={width}
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
