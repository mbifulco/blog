export const getCloudinaryImageUrl = (publicId) => {
  // from https://cloudinary.com/documentation/transformation_reference
  return `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${publicId}`;
};
