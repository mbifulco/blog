import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    CONVERTKIT_API_SECRET: z.string(),
  },
  client: {
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: z.string().min(1),
    NEXT_PUBLIC_FATHOM_ID: z.string().min(8),
  },
  // If you're using Next.js < 13.4.4, you'll need to specify the runtimeEnv manually
  runtimeEnv: {
    // server
    CONVERTKIT_API_SECRET: process.env.CONVERTKIT_API_SECRET,

    // client
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME:
      process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    NEXT_PUBLIC_FATHOM_ID: process.env.NEXT_PUBLIC_FATHOM_ID,
  },
  // For Next.js >= 13.4.4, you only need to destructure client variables:
  experimental__runtimeEnv: {
    // client
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME:
      process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    NEXT_PUBLIC_FATHOM_ID: process.env.NEXT_PUBLIC_FATHOM_ID,
  },
});
