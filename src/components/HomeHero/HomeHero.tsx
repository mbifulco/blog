import { useRef } from 'react';

import { Headshot } from '@components/Headshot';
import Link from '@components/Link';
import config from '@/config';
import HalftoneDot from './HalftoneDot';

type HomeHeroProps = {
  priorityImage?: boolean;
};

const socialLinks = [
  { name: 'Bluesky', href: 'https://bsky.app/profile/mikebifulco.com' },
  { name: 'Threads', href: 'https://threads.net/@irreverentmike' },
  { name: 'Mastodon', href: 'https://hachyderm.io/@irreverentmike' },
];

const HomeHero: React.FC<HomeHeroProps> = ({ priorityImage }) => {
  const zoneRef = useRef<HTMLDivElement>(null);

  return (
    <header className="isolate">
      <div ref={zoneRef} className="relative">
        {/* Sized by the masthead's height so it never crosses the rule below. */}
        <HalftoneDot
          zoneRef={zoneRef}
          className="absolute inset-y-0 right-0 -z-10"
        />
        <h1 className="m-0 font-dumpling text-[clamp(3.25rem,13vw,9rem)] font-normal uppercase leading-[0.86]">
          <span className="riso-mis" data-text="Mike">
            Mike
          </span>
          <br />
          <span className="riso-mis" data-text="Bifulco">
            Bifulco
          </span>
        </h1>
      </div>

      <div className="hero-strap border-riso-pink mt-6 flex flex-col gap-4 border-y-2 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Headshot
            size={56}
            priority={priorityImage}
            className="h-14 w-14 shrink-0 object-cover"
          />
          <p className="m-0 max-w-[60ch] text-pretty font-serif text-base leading-snug sm:text-lg">
            <span className="text-riso-blue font-futura font-bold">
              {config.employer.role.charAt(0).toUpperCase() +
                config.employer.role.slice(1)}{' '}
              at{' '}
              <Link
                href={config.employer.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {config.employer.name}
              </Link>
              .
            </span>{' '}
            Founder and product builder with a background in design and
            development.
          </p>
        </div>
        <ul className="m-0 flex shrink-0 list-none gap-4 p-0 font-futura text-xs font-bold uppercase tracking-[0.1em]">
          {socialLinks.map((link) => (
            <li key={link.name}>
              <Link
                href={link.href}
                target="_blank"
                rel="me noopener noreferrer"
                className="text-ink-muted hover:text-riso-pink"
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
};

export default HomeHero;
