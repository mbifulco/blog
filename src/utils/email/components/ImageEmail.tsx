import { Img } from '@react-email/components';

type ImageEmailProps = {
  publicId: string;
  alt?: string;
};

/**
 * Email-safe version of the Image component.
 * Converts Cloudinary publicId to full URL for email clients.
 */
export const ImageEmail: React.FC<ImageEmailProps> = ({
  publicId,
  alt = '',
}) => {
  const getCloudinaryImageUrl = (publicId: string) => {
    return `https://res.cloudinary.com/mikebifulco-com/image/upload/${publicId}`;
  };

  return (
    <Img
      src={getCloudinaryImageUrl(publicId)}
      alt={alt}
      style={{
        maxWidth: '100%',
        height: 'auto',
        marginTop: 8,
        marginBottom: 8,
      }}
    />
  );
};

export default ImageEmail;
