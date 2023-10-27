import Link from 'next/link';

const SponsorCTA = () => {
  return (
    <p>
      <span role="img" aria-hidden>
        🎟️
      </span>{' '}
      Get in touch to &rarr;{' '}
      <Link
        className="text-pink-600 inline font-bold"
        href="/sponsor"
        target="_blank"
        rel="noopener noreferrer"
      >
        Sponsor Tiny Improvements
      </Link>
    </p>
  );
};

export default SponsorCTA;
