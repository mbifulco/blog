import { Cloudinary } from '@cloudinary/url-gen';

export const getCloudinaryImageUrl = (publicId) => {
  const cld = new Cloudinary({
    cloud: {
      cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    },
  });

  const myImage = cld.image(publicId);
  const url = myImage.toURL();

  return url;
};
