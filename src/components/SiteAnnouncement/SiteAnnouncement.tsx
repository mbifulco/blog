import Link from 'next/link';
import useNewsletterStats from '@hooks/useNewsletterStats';

import clsxm from '@utils/clsxm';

type SiteAnnouncementProps = {
  className?: string;
};
const SiteAnnouncement: React.FC<SiteAnnouncementProps> = ({ className }) => {
  const { subscriberCount } = useNewsletterStats();

  return (
    <div
      className={clsxm(
        'relative flex w-screen max-w-full items-center justify-center bg-pink-400',
        'mt:10 z-[100] py-1 opacity-90 md:sticky md:top-0',
        className
      )}
      style={{
        backgroundImage: `url(/images/wiggle.svg)`,
        backgroundBlendMode: 'color-burn',
      }}
    >
      <Link
        href="/newsletter"
        className={clsxm(
          'text-md group mx-auto flex flex-row gap-4 bg-white/90 px-2 py-1 text-black md:rounded',
          'hover:bg-pink-50 hover:no-underline hover:ring-1 hover:ring-pink-600'
        )}
      >
        <span>
          Join
          <span className="font-bold text-pink-600">
            {' '}
            {subscriberCount ?? 'other'} builders{' '}
          </span>
          &mdash; Get tips from a YC startup founder & ex-Googler. Subscribe to
          💌 Tiny Improvements
        </span>
      </Link>
    </div>
  );
};

export default SiteAnnouncement;
