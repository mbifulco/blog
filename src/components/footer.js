import React from 'react';

import Link from 'next/link';

import { SocialLinks } from './SocialLinks';
import RelatedContentLinksByTag from './RelatedContent/RelatedContentLinksByTag';
import config from '../config';

import SponsorCTA from './SponsorCTA/SponsorCTA';

const Footer = () => {
  return (
    <footer className="relative text-sm pt-8">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <span>© 2019-{new Date().getFullYear()} Mike Bifulco</span>

          <SponsorCTA />
          <SocialLinks />
        </div>
        <div className="flex flex-col gap-2">
          <i as="i" id="disclaimer">
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
                name="Nextjs"
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
            </span>
          </div>
        </div>
      </div>

      <RelatedContentLinksByTag />
    </footer>
  );
};

export default Footer;
