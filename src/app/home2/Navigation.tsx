import NextLink from 'next/link';

import Link from './Link';

const Navigation = () => {
  return (
    <nav className="flex flex-col mb-[2ch]">
      <NextLink className="size-xl font-bold text-6xl" href="/">
        Mike Bifulco
      </NextLink>
      <div className="flex flex-row gap-[1ch]">
        <Link className="text-black" href="/blog">
          Blog
        </Link>
        <Link href="/about">About</Link>
        <Link href="/podcast">Podcast</Link>
        <Link href="/newsletter" className="bg-pink-500 color-white">
          Tiny Improvements
        </Link>
      </div>
    </nav>
  );
};

export default Navigation;
