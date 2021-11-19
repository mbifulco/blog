/* eslint-disable max-len */
import React from 'react';
import PropTypes from 'prop-types';

import { Image as Img } from '@chakra-ui/react';

import { getCloudinaryImageUrl } from '../../utils/images';

function Image(props) {
  const { alt, caption, height, publicId, transformations, width, ...rest } =
    props;

  const url = getCloudinaryImageUrl(publicId);

  return (
    <figure>
      <Img
        // we also have changed `data` to `url` to better describe what `generateUrl` gives us back and makes more sense to pass to `src`
        htmlHeight={height}
        htmlWidth={width}
        src={url}
        alt={alt || caption}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...rest}
        loading="lazy"
      />
      <figcaption>{caption}</figcaption>
    </figure>
  );
}

Image.propTypes = {
  caption: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  publicId: PropTypes.string,
  transformations: PropTypes.arrayOf(PropTypes.string),
  width: PropTypes.string,
  height: PropTypes.string,
  alt: PropTypes.string,
};

export default Image;
