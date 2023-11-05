import { CldImage } from 'next-cloudinary';

type ImageProps = {
  caption?: string;
  publicId?: string;
  transformations?: Array<string>;
  width?: number;
  height?: number;
  alt?: string;
  loading?: 'lazy' | 'eager';
  className?: string;
  priority?: boolean;
};

const Image: React.FC<ImageProps> = ({
  alt,
  caption,
  className,
  height = 630,
  loading = 'lazy',
  publicId,
  transformations,
  width = 1200,
  ...rest
}) => {
  return (
    <figure className="-mx-1 sm:mx-0">
      <CldImage
        height={height}
        width={width}
        src={publicId}
        alt={alt || caption}
        loading={loading}
        className={className}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...rest}
      />
      <figcaption>{caption}</figcaption>
    </figure>
  );
};

export default Image;
