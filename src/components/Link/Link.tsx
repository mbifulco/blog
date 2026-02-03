import NextLink from 'next/link';
import type { ComponentProps } from 'react';

type LinkProps = ComponentProps<typeof NextLink>;

/**
 * Custom Link wrapper - defaults prefetch to false to reduce bandwidth.
 * Links still prefetch on hover, maintaining good UX.
 */
const Link = ({ prefetch = false, ...props }: LinkProps) => {
  return <NextLink prefetch={prefetch} {...props} />;
};

export default Link;
