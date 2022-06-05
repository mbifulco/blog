import { Cloudinary } from '@cloudinary/url-gen';

export const getCloudinaryImageUrl = (publicId) => {
  const cld = new Cloudinary({
    cloud: {
      cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    },
  });

  const myImage = cld.image(publicId).format('auto').quality('auto');
  let url = myImage.toURL({ trackedAnalytics: false });

  // HACK: This fixes a next.js issue with Cloudinary as of React 18, where server and client bundles were rendering differently
  // Cloudinary seems to return images with a URL param of _a=[something] differently on each call of this function
  // including between server and client - Next didn't like this
  // related bug: https://github.com/vercel/next.js/discussions/35773
  if (url.includes('?')) {
    url = url.split('?')[0];
  }
  // let x = new URL(url);
  // if (x.searchParams.has('_a')) {
  //   x.searchParams.delete('_a');
  //   url = x.toString();
  // }

  return url;
};
