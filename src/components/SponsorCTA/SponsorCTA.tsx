import posthog from 'posthog-js';

import Link from '@components/Link';

const SponsorCTA = () => {
  const handleSponsorClick = () => {
    posthog.capture('sponsor_cta_clicked', {
      location: 'newsletter_page',
    });
  };

  return (
    <p>
      <span role="img" aria-hidden>
        🎟️
      </span>{' '}
      Get in touch to &rarr;{' '}
      <Link
        className="inline font-bold text-pink-600"
        href="/sponsor"
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleSponsorClick}
      >
        Sponsor Tiny Improvements
      </Link>
    </p>
  );
};

export default SponsorCTA;
