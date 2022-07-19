import { Cloudinary } from '@cloudinary/url-gen';

export const getCloudinaryImageUrl = (publicId) => {
  const cld = new Cloudinary({
    cloud: {
      cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    },
    url: {
      analytics: false,
    },
  });

  const myImage = cld.image(publicId).format('auto').quality('auto');
  let url = myImage.toURL({ trackedAnalytics: false });

  return url;
};
