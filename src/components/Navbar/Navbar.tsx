'use client';

import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/react';
import { Menu, X } from 'lucide-react';

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@components/ui/navigation-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@components/ui/tooltip';
import clsxm from '@utils/clsxm';

const topics = [
  {
    title: 'React & JavaScript',
    href: '/topics/react-development',
    description: 'Tutorials on React, Next.js, TypeScript, and modern JS',
    icon: '⚛️',
  },
  {
    title: 'Startups & Founders',
    href: '/topics/startup-building',
    description: 'Lessons from founding startups and Y Combinator',
    icon: '🚀',
  },
  {
    title: 'Design & UX',
    href: '/topics/design-ux',
    description: 'Design systems, user experience, and cognitive science',
    icon: '🎨',
  },
  {
    title: 'Developer Tools',
    href: '/topics/developer-productivity',
    description: 'Tools and workflows for developer productivity',
    icon: '🛠️',
  },
];

const browseLinks = [
  {
    title: '💌 Tiny Improvements',
    href: '/newsletter',
    description: 'My weekly newsletter for product builders',
  },
  {
    title: 'All Articles',
    href: '/',
    description: 'Technical posts and tutorials',
  },
  { title: 'Browse by Tag', href: '/tags', description: 'Find posts by tag' },
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
                  'text-center text-4xl uppercase text-gray-800 transition-all duration-500 ease-in-out hover:text-gray-700',
                  '-my-2 font-dumpling text-lg md:text-4xl'
                )}
              >
                Mike Bifulco
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="ml-auto sm:ml-0 sm:justify-center">
              <div className="hidden items-center justify-center sm:flex">
                <NavigationMenu>
                  <NavigationMenuList>
                    {/* Topics Dropdown */}
                    <NavigationMenuItem>
                      <NavigationMenuTrigger className="bg-transparent text-sm font-semibold uppercase text-gray-700 hover:bg-gray-100">
                        Topics
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
                          {topics.map((topic) => (
                            <li key={topic.href}>
                              <NavigationMenuLink asChild>
                                <Link
                                  href={topic.href}
                                  className={clsxm(
                                    'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors',
                                    'hover:bg-pink-50 hover:text-pink-900 focus:bg-pink-50'
                                  )}
                                >
                                  <div className="flex items-center gap-2 text-sm font-medium leading-none text-gray-900">
                                    <span>{topic.icon}</span>
                                    <span>{topic.title}</span>
                                  </div>
                                  <p className="line-clamp-2 text-sm leading-snug text-gray-500">
                                    {topic.description}
                                  </p>
                                </Link>
                              </NavigationMenuLink>
                            </li>
                          ))}
                          <li className="col-span-2 border-t pt-2">
                            <NavigationMenuLink asChild>
                              <Link
                                href="/topics"
                                className="block text-center text-sm font-medium text-pink-600 hover:underline"
                              >
                                View all topics →
                              </Link>
                            </NavigationMenuLink>
                          </li>
                        </ul>
                      </NavigationMenuContent>
                    </NavigationMenuItem>

                    {/* Browse Dropdown */}
                    <NavigationMenuItem>
                      <NavigationMenuTrigger className="bg-transparent text-sm font-semibold uppercase text-gray-700 hover:bg-gray-100">
                        Browse
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <ul className="grid w-[300px] gap-2 p-4">
                          {browseLinks.map((link) => (
                            <li key={link.href}>
                              <NavigationMenuLink asChild>
                                <Link
                                  href={link.href}
                                  className={clsxm(
                                    'block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors',
                                    'hover:bg-pink-50 hover:text-pink-900 focus:bg-pink-50'
                                  )}
                                >
                                  <div className="text-sm font-medium leading-none text-gray-900">
                                    {link.title}
                                  </div>
                                  <p className="mt-1 text-sm leading-snug text-gray-500">
                                    {link.description}
                                  </p>
                                </Link>
                              </NavigationMenuLink>
                            </li>
                          ))}
                        </ul>
                      </NavigationMenuContent>
                    </NavigationMenuItem>

                    {/* Podcast - Simple Link */}
                    <NavigationMenuItem>
                      <Link href="/podcast" legacyBehavior passHref>
                        <NavigationMenuLink
                          className={clsxm(
                            'group inline-flex h-9 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-semibold uppercase text-gray-700 transition-colors hover:bg-gray-100'
                          )}
                        >
                          Podcast
                        </NavigationMenuLink>
                      </Link>
                    </NavigationMenuItem>

                    {/* About - Simple Link */}
                    <NavigationMenuItem>
                      <Link href="/about" legacyBehavior passHref>
                        <NavigationMenuLink
                          className={clsxm(
                            'group inline-flex h-9 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-semibold uppercase text-gray-700 transition-colors hover:bg-gray-100'
                          )}
                        >
                          About
                        </NavigationMenuLink>
                      </Link>
                    </NavigationMenuItem>

                    {/* Newsletter CTA */}
                    <NavigationMenuItem>
                      <TooltipProvider delayDuration={200}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Link
                              href="/newsletter"
                              className={clsxm(
                                'inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors',
                                'bg-pink-500 text-white no-underline hover:bg-pink-600 hover:text-white hover:no-underline'
                              )}
                            >
                              💌 Tiny Improvements
                            </Link>
                          </TooltipTrigger>
                          <TooltipContent side="bottom">
                            <p>My weekly newsletter for builders & creators</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </NavigationMenuItem>
                  </NavigationMenuList>
                </NavigationMenu>
              </div>

              {/* Mobile menu button */}
              <div className="-mr-2 flex items-center sm:hidden">
                <DisclosureButton className="focus:outline-hidden relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-pink-500">
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

          {/* Mobile Navigation */}
          <DisclosurePanel className="sm:hidden">
            <div className="space-y-1 pb-3 pt-2">
              {/* Topics Section */}
              <div className="border-b border-gray-200 pb-2">
                <p className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Topics
                </p>
                {topics.map((topic) => (
                  <DisclosureButton
                    as={Link}
                    href={topic.href}
                    key={topic.href}
                    className="block py-2 pl-6 pr-4 text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  >
                    <span className="mr-2">{topic.icon}</span>
                    {topic.title}
                  </DisclosureButton>
                ))}
                <DisclosureButton
                  as={Link}
                  href="/topics"
                  className="block py-2 pl-6 pr-4 text-sm font-medium text-pink-600 hover:bg-pink-50"
                >
                  View all topics →
                </DisclosureButton>
              </div>

              {/* Browse Section */}
              <div className="border-b border-gray-200 pb-2">
                <p className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Browse
                </p>
                {browseLinks.map((link) => (
                  <DisclosureButton
                    as={Link}
                    href={link.href}
                    key={link.href}
                    className="block py-2 pl-6 pr-4 text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  >
                    {link.title}
                  </DisclosureButton>
                ))}
              </div>

              {/* Other Links */}
              <DisclosureButton
                as={Link}
                href="/podcast"
                className={clsxm(
                  'block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700',
                  router.pathname === '/podcast' &&
                    'border-pink-500 bg-pink-50 text-pink-700'
                )}
              >
                Podcast
              </DisclosureButton>

              <DisclosureButton
                as={Link}
                href="/about"
                className={clsxm(
                  'block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700',
                  router.pathname === '/about' &&
                    'border-pink-500 bg-pink-50 text-pink-700'
                )}
              >
                About
              </DisclosureButton>

              {/* Newsletter CTA */}
              <div className="px-3 pt-2">
                <DisclosureButton
                  as={Link}
                  href="/newsletter"
                  className="block w-full rounded-md bg-pink-500 px-4 py-2 text-center font-medium text-white hover:bg-pink-600"
                >
                  💌 Subscribe to Newsletter
                </DisclosureButton>
              </div>
            </div>
          </DisclosurePanel>
        </>
      )}
    </Disclosure>
  );
};

export default Navbar;
