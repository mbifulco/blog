import Link from 'next/link';

import clsxm from '@utils/clsxm';
import config from '../../config';

type SiteAnnouncementProps = {
  className?: string;
  sticky?: boolean;
};
const SiteAnnouncement: React.FC<SiteAnnouncementProps> = ({
  className = '',
  sticky = false,
}) => {
  let { shortDescription } = config.newsletter;

  // make first character lower case
  shortDescription =
    shortDescription.charAt(0).toLowerCase() + shortDescription.slice(1);

  return (
    <div
      className={clsxm(
        'flex w-screen max-w-full items-center justify-center bg-gray-50 transition-all duration-500 ease-in-out',
        sticky && 'sticky top-0 z-[100]',
        className
      )}
      style={{ backgroundImage: `url(/images/wiggle.svg)` }}
    >
      <div className="mx-auto flex flex-row gap-4 px-2 py-1 text-md text-black bg-white/80">
        <p>
          Subscribe to{' '}
          <Link
            href="/newsletter"
            className="font-bold text-pink-600 hover:no-underline hover:text-pink-900"
          >
            💌 Tiny Improvements
          </Link>
          , {shortDescription}
        </p>
      </div>
      {/* <button
        className="mr-4 text-white hover:text-pink-300"
      >
        <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
      </button> */}
    </div>
  );
};

export default SiteAnnouncement;
