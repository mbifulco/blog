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

  return (
    <div
      className={clsxm(
        'flex w-screen max-w-full items-center justify-center bg-pink-400 transition-all duration-500 ease-in-out',
        'sticky top-0 z-[100] py-1',
        className
      )}
      style={{
        backgroundImage: `url(/images/wiggle.svg)`,
        backgroundBlendMode: 'color-burn',
      }}
    >
      <Link
        href="/newsletter"
        className="text-md group mx-auto flex flex-row gap-4 rounded bg-white/90 px-2 py-1 text-black hover:bg-pink-400 hover:text-white hover:no-underline"
      >
        <span>
          Join
          <span className="group-hover:text-white-200 font-bold text-pink-600">
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
