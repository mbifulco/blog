import { Cloudinary } from '@cloudinary/url-gen';

export const getCloudinaryImageUrl = (publicId) => {
  const cld = new Cloudinary({
    cloud: {
      cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    },
    url: {
      analytics: false, // this turns off the _a= param in generated URLs, to avoid problems with React Hydration errors
    },
  });

  return cld.image(publicId).addTransformation('q_auto:eco,f_auto').toURL();
};
