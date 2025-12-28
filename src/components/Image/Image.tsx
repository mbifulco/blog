import { CldImage } from 'next-cloudinary';

type ImageProps = {
  alt?: string;
  bare?: boolean;
  caption?: React.ReactNode;
  className?: string;
  height?: number;
  loading?: 'lazy' | 'eager';
  priority?: boolean;
  publicId?: string;
  sizes?: string;
  transformations?: string[];
  width?: number;
};

const Image: React.FC<ImageProps> = ({
  alt,
  bare = false,
  caption,
  className,
  height = 630,
  loading = 'lazy',
  publicId,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px',
  transformations,
  width = 1200,
  ...rest
}) => {
  if (!publicId) {
    console.warn('No public ID provided for image');
    return null;
  }

  const renderedImage = (
    <CldImage
      height={height}
      width={width}
      src={publicId}
      alt={alt ?? publicId}
      loading={loading}
      className={className}
      sizes={sizes}
      style={{ aspectRatio: `${width}/${height}` }}
      transformations={transformations}
      {...rest}
    />
  );

  if (bare) {
    return renderedImage;
  }

  return (
    <figure className="-mx-1 my-0 flex flex-col items-center justify-center sm:mx-auto">
      {renderedImage}
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
};

export default Image;
