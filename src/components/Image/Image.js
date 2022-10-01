/* eslint-disable max-len */
import React from 'react';
import PropTypes from 'prop-types';

import { CloudinaryImage } from '@cloudinary/url-gen';
import { AdvancedImage, responsive } from '@cloudinary/react';

const Image = ({ alt, caption, publicId, ...rest }) => {
  const cloudinaryImage = new CloudinaryImage(publicId, {
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  });

  return (
    <figure>
      <AdvancedImage
        alt={alt}
        cldImg={cloudinaryImage}
        plugins={[responsive()]}
      />
      <figcaption>{caption}</figcaption>
    </figure>
  );
};

Image.propTypes = {
  caption: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  publicId: PropTypes.string,
  alt: PropTypes.string,
};

export default Image;
