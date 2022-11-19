import React from 'react';
import NextLink, { LinkProps } from 'next/link';

const Link: React.FC<LinkProps & React.HTMLProps<HTMLAnchorElement>> = ({
  as,
  children,
  href,
  replace,
  scroll,
  shallow,
  passHref,
  className,
}) => {
  return (
    <NextLink
      className={`text-pink-500 hover:text-pink-600 hover:underline ${className}`}
      as={as}
      href={href}
      passHref={passHref}
      replace={replace}
      scroll={scroll}
      shallow={shallow}
    >
      {children}
    </NextLink>
  );
};

export default Link;
