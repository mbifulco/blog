import { Image as Img } from '@chakra-ui/react';

import { getCloudinaryImageUrl } from '../../utils/images';

type ImageProps = {
  caption?: string;
  publicId?: string;
  transformations?: Array<string>;
  width?: string | number;
  height?: string | number;
  alt?: string;
  loading?: 'lazy' | 'eager';
  className?: string;
};

const Image: React.FC<ImageProps> = ({
  alt,
  caption,
  className,
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
        // we also have changed `data` to `url` to better describe what `generateUrl`
        // gives us back and makes more sense to pass to `src`
        htmlHeight={height}
        htmlWidth={width}
        src={url}
        alt={alt || caption}
        // eslint-disable-next-line react/jsx-props-no-spreading
        loading={loading}
        className={className}
        {...rest}
      />
      <figcaption>{caption}</figcaption>
    </figure>
  );
};

export default Image;
