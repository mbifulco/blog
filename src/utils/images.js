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

  const myImage = cld.image(publicId);
  let url = myImage.toURL({ trackedAnalytics: false });

  return url;
};
