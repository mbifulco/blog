import type { ComponentProps } from 'react';
import NextLink from 'next/link';

type LinkProps = ComponentProps<typeof NextLink>;

/**
 * Custom Link wrapper - defaults prefetch to false to reduce bandwidth.
 * Full prefetch behavior can be enabled per-link with prefetch={true}.
 */
const Link = ({ prefetch = false, ...props }: LinkProps) => {
  return <NextLink prefetch={prefetch} {...props} />;
};

export default Link;
