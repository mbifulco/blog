'use client';

import { useRouter } from 'next/router';
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/react';
import { Menu, Search, X } from 'lucide-react';

import { GooseNeck } from '@components/GooseMark';
import Link from '@components/Link';
import { useSearch } from '@components/Search/SearchContext';
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
  },
  {
    title: 'Startups & Founders',
    href: '/topics/startup-building',
  },
  {
    title: 'Design & UX',
    href: '/topics/design-ux',
  },
  {
    title: 'Developer Tools',
    href: '/topics/developer-productivity',
  },
];

const browseLinks = [
  {
    title: '💌 Tiny Improvements',
    href: '/newsletter',
  },
  {
    title: 'All Articles',
    href: '/',
  },
  { title: 'Browse by Tag', href: '/tags' },
];

const Navbar = () => {
  const router = useRouter();
  const { setOpen } = useSearch();
  const isHome = router.pathname === '/';

  const itemClass = clsxm(
    'group inline-flex h-9 w-max items-center justify-center gap-1.5 bg-transparent px-3 py-2',
    'font-futura text-[0.8rem] font-bold uppercase tracking-[0.1em] text-riso-blue no-underline transition-colors',
    'hover:bg-transparent hover:text-riso-pink hover:no-underline focus:bg-transparent data-[state=open]:bg-transparent data-[state=open]:text-riso-pink'
  );
  const mobileLinkClass =
    'block px-3 py-2 font-futura text-base font-bold text-riso-blue no-underline hover:bg-tint-pink hover:text-riso-blue';

  return (
    <Disclosure as="nav" className="w-full px-4">
      {({ open }) => (
        <div className="mx-auto w-full max-w-6xl">
          <div className="border-riso-blue flex w-full items-center justify-between gap-4 border-b-2 pb-3">
            <div className="flex min-w-0 items-center gap-3 self-stretch">
              {/* Pulled into the bottom padding so the neck rises from behind the rule;
                  the right margin makes room for the burst spilling off the bill */}
              <Link
                href="/"
                prefetch={true}
                aria-label="Mike Bifulco, home"
                className="group -mb-3 mr-1 shrink-0 self-end no-underline hover:no-underline sm:mr-5"
              >
                <GooseNeck className="h-14 w-auto sm:h-16 md:h-[4.5rem]" />
              </Link>
              {/* The home page masthead is the wordmark there */}
              {isHome ? (
                <Link
                  href="/newsletter"
                  prefetch={true}
                  className="text-riso-pink hover:text-riso-blue text-balance font-futura text-xs font-bold uppercase leading-tight tracking-[0.12em] no-underline hover:no-underline sm:text-sm"
                >
                  Build products that matter
                </Link>
              ) : (
                <Link
                  href="/"
                  prefetch={true}
                  className="text-riso-pink hover:text-riso-blue font-dumpling text-xl uppercase leading-none no-underline hover:no-underline md:text-2xl"
                >
                  Mike Bifulco
                </Link>
              )}
            </div>

            <div className="hidden items-center md:flex">
              <Link
                href="/newsletter"
                prefetch={true}
                className={clsxm(
                  itemClass,
                  router.pathname.startsWith('/newsletter') && 'text-riso-pink'
                )}
              >
                Newsletter
              </Link>
              <Link
                href="/about"
                prefetch={true}
                className={clsxm(
                  itemClass,
                  router.pathname === '/about' && 'text-riso-pink'
                )}
              >
                About
              </Link>
              <button
                onClick={() => setOpen(true)}
                className={itemClass}
                aria-label="Search"
              >
                <Search className="h-4 w-4" />
                <span className="hidden lg:inline">Search</span>
                <kbd className="border-riso-blue/40 hidden border px-1 py-0.5 font-mono text-[0.7rem] tracking-normal lg:inline">
                  ⌘K
                </kbd>
              </button>
              <TooltipProvider delayDuration={200}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href="/subscribe"
                      prefetch={true}
                      className={clsxm(
                        'ml-2 inline-flex h-9 w-max items-center justify-center px-4 py-2 font-futura text-[0.8rem] font-bold uppercase tracking-[0.08em] transition-colors',
                        'bg-pink-fill text-on-fill hover:bg-blue-fill hover:text-on-fill no-underline hover:no-underline'
                      )}
                    >
                      💌 Subscribe
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>
                      Tiny Improvements, my weekly newsletter for product
                      builders
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <div className="-mr-2 flex items-center md:hidden">
              <DisclosureButton className="text-riso-blue hover:bg-tint-blue focus-visible:ring-riso-pink relative inline-flex items-center justify-center p-2 focus:outline-none focus-visible:ring-2">
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

          <DisclosurePanel className="border-riso-blue border-b-2 md:hidden">
            <div className="space-y-1 pb-3 pt-2">
              <div className="border-border border-b pb-2">
                <DisclosureButton
                  as="button"
                  onClick={() => setOpen(true)}
                  className={clsxm(
                    mobileLinkClass,
                    'flex w-full items-center gap-2'
                  )}
                >
                  <Search className="h-4 w-4" />
                  Search
                </DisclosureButton>
              </div>

              <div className="border-border border-b pb-2">
                <p className="riso-kicker px-3 py-1">Topics</p>
                {topics.map((topic) => (
                  <DisclosureButton
                    as={Link}
                    href={topic.href}
                    key={topic.href}
                    className={mobileLinkClass}
                  >
                    {topic.title}
                  </DisclosureButton>
                ))}
                <DisclosureButton
                  as={Link}
                  href="/topics"
                  className="text-riso-pink block px-3 py-2 font-futura text-sm font-bold no-underline"
                >
                  View all topics →
                </DisclosureButton>
              </div>

              <div className="border-border border-b pb-2">
                <p className="riso-kicker px-3 py-1">Browse</p>
                {browseLinks.map((link) => (
                  <DisclosureButton
                    as={Link}
                    href={link.href}
                    key={link.href}
                    className={mobileLinkClass}
                  >
                    {link.title}
                  </DisclosureButton>
                ))}
              </div>

              <DisclosureButton
                as={Link}
                href="/podcast"
                prefetch={true}
                className={clsxm(
                  mobileLinkClass,
                  router.pathname === '/podcast' && 'text-riso-pink'
                )}
              >
                Podcast
              </DisclosureButton>

              <DisclosureButton
                as={Link}
                href="/about"
                prefetch={true}
                className={clsxm(
                  mobileLinkClass,
                  router.pathname === '/about' && 'text-riso-pink'
                )}
              >
                About
              </DisclosureButton>

              <div className="px-3 pt-2">
                <DisclosureButton
                  as={Link}
                  href="/subscribe"
                  prefetch={true}
                  className="bg-pink-fill text-on-fill hover:bg-blue-fill hover:text-on-fill block w-full px-4 py-3 text-center font-futura font-bold uppercase tracking-[0.08em] no-underline"
                >
                  💌 Subscribe to Tiny Improvements
                </DisclosureButton>
              </div>
            </div>
          </DisclosurePanel>
        </div>
      )}
    </Disclosure>
  );
};

export default Navbar;
