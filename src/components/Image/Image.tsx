import { CldImage } from 'next-cloudinary';

type ImageProps = {
  caption?: React.ReactNode;
  publicId?: string;
  transformations?: string[];
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
  if (!publicId) {
    console.warn('No public ID provided for image');
    return null;
  }

  return (
    <figure className="-mx-1 sm:mx-0">
      <CldImage
        height={height}
        width={width}
        src={publicId}
        alt={alt ?? publicId}
        loading={loading}
        className={className}
        transformations={transformations}
        {...rest}
      />
      <figcaption>{caption}</figcaption>
    </figure>
  );
};

export default Image;
