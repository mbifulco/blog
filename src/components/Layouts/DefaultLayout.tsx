import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import clsx from 'clsx';

import MDXProviderWrapper from '../../utils/MDXProviderWrapper';
import Footer from '../footer';

const DefaultLayout = ({ children }) => {
  const router = useRouter();
  const { pathname } = router;

  const [isHomePage, setIsHomePage] = useState(pathname === '/');

  useEffect(() => {
    setIsHomePage(pathname === '/');
  }, [pathname]);

  return (
    <MDXProviderWrapper>
      <div className="w-full border-t-[1.25rem] border-solid border-pink-400 pt-4 md:pt-8">
        <div className="mx-auto my-0 flex w-full flex-col px-1 py-0 lg:w-[50rem] lg:p-0">
          <div
            className={clsx(
              'column flex flex-col items-start justify-between gap-2 overflow-y-hidden pb-6 md:flex-row',
              isHomePage && 'lg:items-center lg:justify-between'
            )}
          >
            <div
              className={clsx(
                'flex flex-col items-start md:flex-row md:items-center',
                isHomePage ? 'text-lg md:text-xl xl:text-3xl' : 'text-lg'
              )}
            >
              <Link className="no-underline hover:no-underline" href="/">
                <p
                  className={clsx(
                    'm-0 cursor-pointer p-0 font-bold text-black transition-all duration-1000 ease-in-out hover:no-underline',
                    isHomePage ? 'text-6xl' : 'text-lg'
                  )}
                >
                  Mike Bifulco
                </p>
              </Link>
            </div>

            <div className="flex w-full flex-row flex-wrap justify-between gap-2 px-1 sm:w-fit sm:justify-normal">
              <Link className="text-black hover:underline" href="/">
                Articles
              </Link>
              <Link className="text-black hover:underline" href="/podcast">
                Podcast
              </Link>
              <Link className="text-black hover:underline" href="/about">
                About
              </Link>
              <Link
                className="whitespace-nowrap rounded-sm bg-pink-400 px-[1ch] py-0 text-white hover:bg-pink-500 hover:text-white hover:no-underline active:bg-pink-600"
                href="/newsletter"
              >
                💌 Tiny Improvements
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-8">{children}</div>

          <Footer />
        </div>
      </div>
    </MDXProviderWrapper>
  );
};

export default DefaultLayout;
