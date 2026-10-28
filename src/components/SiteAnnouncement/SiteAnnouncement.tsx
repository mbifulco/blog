import Link from '@components/Link';
import SubscriberCount from '@components/NewsletterSignup/SubscriberCount';
import clsxm from '@utils/clsxm';

type SiteAnnouncementProps = {
  className?: string;
};
const SiteAnnouncement: React.FC<SiteAnnouncementProps> = ({ className }) => {
  return (
    <div
      className={clsxm(
        'z-100 bg-pink-fill text-on-fill relative w-full md:sticky md:top-0',
        className
      )}
    >
      <Link
        href="/newsletter"
        className={clsxm(
          'text-on-fill mx-auto flex max-w-6xl items-center justify-center gap-2 px-4 py-2 text-center text-sm font-medium no-underline',
          'hover:text-on-fill hover:decoration-on-fill hover:underline'
        )}
      >
        <span>
          Join{' '}
          <span className="font-futura font-bold">
            <SubscriberCount /> other builders
          </span>{' '}
          getting tips from a YC startup founder &amp; ex-Googler.{' '}
          <span className="whitespace-nowrap font-futura font-bold">
            Subscribe to 💌 Tiny Improvements →
          </span>
        </span>
      </Link>
    </div>
  );
};

export default SiteAnnouncement;
