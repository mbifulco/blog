'use client';

import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/react';
import { Menu, X } from 'lucide-react';

import clsxm from '@utils/clsxm';

const NavLinks: { title: string; href: string; badge?: boolean }[] = [
  {
    title: 'Articles',
    href: '/',
  },
  {
    title: 'Podcast',
    href: '/podcast',
  },
  {
    title: 'About',
    href: '/about',
  },
  {
    title: '💌 Tiny Improvements',
    href: '/newsletter',
    badge: true,
  },
];

const Navbar = () => {
  const router = useRouter();
  return (
    <Disclosure as="nav" className="w-full bg-white">
      {({ open }) => (
        <>
          <div className="flex w-full flex-row gap-3 sm:mx-auto sm:flex-col">
            <Link href="/" className="hover:no-underline">
              <div
                className={clsxm(
                  'text-center text-4xl text-gray-800 uppercase transition-all duration-500 ease-in-out hover:text-gray-700',
                  'font-dumpling -my-2 text-lg md:text-4xl'
                )}
              >
                Mike Bifulco
              </div>
            </Link>
            <div className="ml-auto sm:ml-0 sm:justify-center">
              <div className="hidden items-center justify-center sm:ml-6 sm:flex sm:space-x-8">
                {/* Current: "border-indigo-500 text-gray-900", Default: "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700" */}
                {NavLinks.map((link) => (
                  <Link
                    href={link.href}
                    key={link.href}
                    className={clsxm(
                      'hover:textfont-extrabold inline-flex items-center px-1 pt-1 text-sm font-semibold text-gray-700 uppercase hover:border-gray-300',
                      'hover:no-underline',
                      link.href === router.pathname && 'text-gray-900',
                      link.badge &&
                        'rounded-xs bg-pink-400 px-[0.5ch] py-[0.25ch] font-medium text-white hover:bg-pink-600 hover:text-white'
                    )}
                  >
                    {link.title}
                  </Link>
                ))}
              </div>
              <div className="-mr-2 flex items-center sm:hidden">
                {/* Mobile menu button */}
                <DisclosureButton className="hover:bg--100 relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:text-gray-500 focus:ring-2 focus:ring-pink-500 focus:outline-hidden focus:ring-inset">
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <X className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Menu className="block h-6 w-6" aria-hidden="true" />
                  )}
                </DisclosureButton>
              </div>
            </div>
          </div>

          <DisclosurePanel className="sm:hidden">
            <div className="space-y-1 pt-2 pb-3">
              {/* Current: "bg-indigo-50 border-indigo-500 text-indigo-700", Default: "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700" */}
              {NavLinks.map((link) => (
                <DisclosureButton
                  as={Link}
                  href={link.href}
                  key={link.href}
                  className={clsxm(
                    'block border-l-4 border-transparent py-2 pr-4 pl-3 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700',
                    link.href === router.pathname &&
                      'border-pink-500 bg-pink-50 text-pink-700',
                    link.badge &&
                      'rounded-xs bg-pink-400 px-[0.5ch] py-[0.25ch] text-white hover:bg-pink-600 hover:text-white'
                  )}
                >
                  {link.title}
                </DisclosureButton>
              ))}
            </div>
          </DisclosurePanel>
        </>
      )}
    </Disclosure>
  );
};

export default Navbar;
