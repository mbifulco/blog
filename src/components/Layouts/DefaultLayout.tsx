/* eslint-disable jsx-a11y/anchor-is-valid */
import { useEffect, useState } from 'react';
import Link from 'next/link';

import { useRouter } from 'next/router';

import Footer from '../footer';

import MDXProviderWrapper from '../../utils/MDXProviderWrapper';
import clsx from 'clsx';

const DefaultLayout = ({ children }) => {
  const router = useRouter();
  const { pathname } = router;

  const [isHomePage, setIsHomePage] = useState(pathname === '/');

  useEffect(() => {
    setIsHomePage(pathname === '/');
  }, [pathname]);

  return (
    <MDXProviderWrapper>
      <div className="border-t-[1.25rem] border-pink-400 border-solid pt-4 md:pt-8 w-full">
        <div className="w-full lg:w-[50rem] mx-auto my-0 py-0 px-1 lg:p-0 flex flex-col">
          <div
            className={clsx(
              'flex flex-col gap-2 md:flex-row overflow-y-hidden items-start column justify-between pb-6',
              isHomePage && 'lg:items-center lg:justify-between'
            )}
          >
            <div
              className={clsx(
                'flex flex-col md:flex-row items-start md:items-center',
                isHomePage ? 'text-lg md:text-xl xl:text-3xl' : 'text-lg'
              )}
            >
              <Link className="no-underline hover:no-underline" href="/">
                <p
                  className={clsx(
                    'transition-all duration-1000 ease-in-out font-bold m-0 p-0 text-black cursor-pointer hover:no-underline',
                    isHomePage ? 'text-6xl' : 'text-lg'
                  )}
                >
                  Mike Bifulco
                </p>
              </Link>
            </div>

            <div className="flex flex-row flex-wrap gap-2 justify-between sm:justify-normal sm:w-fit w-full px-1">
              <Link className="text-black hover:underline" href="/">
                Blog
              </Link>
              <Link className="text-black hover:underline" href="/podcast">
                Podcast
              </Link>
              <Link className="text-black hover:underline" href="/about">
                About
              </Link>
              <Link
                className="bg-pink-400 hover:bg-pink-500 active:bg-pink-600 hover:no-underline text-white hover:text-white py-0 px-[1ch] rounded-sm whitespace-nowrap"
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
