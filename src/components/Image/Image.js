/* eslint-disable max-len */
import React from 'react';
import PropTypes from 'prop-types';

import { Image as Img } from '@chakra-ui/react';

import { getCloudinaryImageUrl } from '../../utils/images';

const Image = ({
  alt,
  caption,
  height,
  loading = 'lazy',
  publicId,
  transformations,
  width,
  ...rest
}) => {
  const url = getCloudinaryImageUrl(publicId);

  return (
    <figure>
      <Img
        height={height}
        width={width}
        // we also have changed `data` to `url` to better describe what `generateUrl` gives us back and makes more sense to pass to `src`
        htmlHeight={height}
        htmlWidth={width}
        src={url}
        alt={alt || caption}
        // eslint-disable-next-line react/jsx-props-no-spreading
        loading={loading}
        {...rest}
      />
      <figcaption>{caption}</figcaption>
    </figure>
  );
};

Image.propTypes = {
  caption: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  publicId: PropTypes.string,
  transformations: PropTypes.arrayOf(PropTypes.string),
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  alt: PropTypes.string,
};

export default Image;
