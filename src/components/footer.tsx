import { useRouter } from 'next/router';

import { GooseWalker } from '@components/GooseMark';
import Link from '@components/Link';
import { PreferredSource } from '@components/PreferredSource';
import config from '../config';
import RelatedContentLinksByTag from './RelatedContent/RelatedContentLinksByTag';
import { SocialLinks } from './SocialLinks';
import SponsorCTA from './SponsorCTA/SponsorCTA';

const Footer = () => {
  const router = useRouter();

  return (
    <footer className="border-riso-blue bg-tint-blue relative mt-24 border-t-2">
      <GooseWalker />
      <div className="text-ink mx-auto max-w-6xl px-4 pb-10 pt-12 text-sm">
        <RelatedContentLinksByTag />

        <div className="border-riso-blue/30 grid gap-8 border-t pt-8 md:grid-cols-2">
          <div className="flex flex-col gap-3">
            <span>
              <Link className="font-bold" href="/integrity">
                Sponsorships &amp; Transparency
              </Link>
            </span>
            <span className="text-ink-muted text-xs">
              © 2019-{new Date().getFullYear()} Mike Bifulco
            </span>

            <SponsorCTA />
            <PreferredSource />
            <SocialLinks />
          </div>

          <div className="flex flex-col gap-3">
            <i id="disclaimer" className="text-ink-muted font-serif text-base">
              Disclaimer:{' '}
              <span role="img" aria-label="wave">
                👋🏽
              </span>{' '}
              Hi there. I work as a {config.employer.role} at{' '}
              {config.employer.name}. These are my opinions, and not necessarily
              the views of my employer.
            </i>

            <div className="credit">
              <span>
                Built with{' '}
                <Link
                  href="https://nextjs.org/"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  Next
                </Link>
                .
              </span>{' '}
              <span>
                Source code on{' '}
                <Link
                  href="https://github.com/mbifulco/blog"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  GitHub
                </Link>
                .
              </span>{' '}
            </div>
          </div>
        </div>

        {router.pathname !== '/' && (
          <p
            aria-hidden
            className="m-0 mt-12 select-none font-dumpling text-[clamp(2.5rem,11vw,7.5rem)] uppercase leading-[0.85]"
          >
            <span className="riso-mis" data-text="Mike Bifulco">
              Mike Bifulco
            </span>
          </p>
        )}
      </div>
    </footer>
  );
};

export default Footer;
