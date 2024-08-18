import Link from 'next/link';
import useNewsletterStats from '@hooks/useNewsletterStats';

import clsxm from '@utils/clsxm';

type SiteAnnouncementProps = {
  className?: string;
  sticky?: boolean;
};
const SiteAnnouncement: React.FC<SiteAnnouncementProps> = ({
  className = '',
  sticky = false,
}) => {
  const { subscriberCount } = useNewsletterStats();

  const socialProof = subscriberCount && subscriberCount > 0 && (
    <>
      Ready to build better products? Join{' '}
      <span className="font-bold text-pink-600">
        {' '}
        {subscriberCount ?? 'other'} builders{' '}
      </span>
    </>
  );

  return (
    <div
      className={clsxm(
        'flex w-screen max-w-full items-center justify-center bg-gray-50 transition-all duration-500 ease-in-out',
        sticky && 'sticky top-0 z-[100]',
        className
      )}
      // style={{ backgroundImage: `url(/images/wiggle.svg)` }}
    >
      <Link
        href="/newsletter"
        className="text-md mx-auto flex flex-row gap-4 px-2 py-1 text-black"
      >
        <p>
          {socialProof} by subscribing to{' '}
          <span className="font-bold text-pink-600 hover:text-pink-900 hover:no-underline">
            💌 Tiny Improvements
          </span>
          - it&apos;s free!
        </p>
      </Link>
    </div>
  );
};

export default SiteAnnouncement;
