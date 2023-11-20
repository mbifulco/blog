import Link from 'next/link';

import clsxm from '@utils/clsxm';

type SiteAnnouncementProps = {
  className?: string;
  sticky?: boolean;
};
const SiteAnnouncement: React.FC<SiteAnnouncementProps> = ({
  className = '',
  sticky = false,
}) => {
  return (
    <div
      className={clsxm(
        'flex w-screen max-w-full items-center justify-center bg-[#8d5781] py-3 transition-all duration-500 ease-in-out',
        sticky && 'sticky top-0 z-[100]',
        className
      )}
    >
      <div className="mx-auto flex flex-row gap-4 px-2 text-sm text-white">
        <p>
          Subscribe to{' '}
          <Link
            href="/newsletter"
            className="font-bold text-pink-300 hover:underline"
          >
            💌 Tiny Improvements
          </Link>
          , my weekly newsletter for product builders. It&apos;s a single, tiny
          idea to help you build better products.
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
