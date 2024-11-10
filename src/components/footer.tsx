import Link from 'next/link';

import config from '../config';
import RelatedContentLinksByTag from './RelatedContent/RelatedContentLinksByTag';
import { SocialLinks } from './SocialLinks';
import SponsorCTA from './SponsorCTA/SponsorCTA';

const Footer = () => {
  return (
    <footer
      className="bg-gray-50 py-10"
      style={{ backgroundImage: `url(/images/wiggle.svg)` }}
    >
      <div className="mx-auto max-w-4xl rounded-xl bg-white/80 p-4 text-sm text-black xl:relative">
        <RelatedContentLinksByTag />

        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <span>
              <Link className="text-pink-600" href="/integrity">
                Sponsorships &amp; Transparency
              </Link>
            </span>
            <span>© 2019-{new Date().getFullYear()} Mike Bifulco</span>

            <SponsorCTA />
            <SocialLinks />
          </div>

          <div className="flex flex-col gap-2">
            <i id="disclaimer">
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
                  className="text-pink-600"
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
                  className="text-pink-600"
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
      </div>
    </footer>
  );
};

export default Footer;
