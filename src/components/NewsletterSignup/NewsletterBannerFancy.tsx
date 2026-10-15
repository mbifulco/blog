import clsxm from '@utils/clsxm';
import config from '../../config';
import { Headshot } from '../Headshot';
import SponsorCTA from '../SponsorCTA/SponsorCTA';
import { SubscriptionForm } from '../SubscriptionForm';
import SubscriberCount from './SubscriberCount';

type NewsletterBannerFancyProps = {
  /** "band" lays the pitch and form side by side and drops the headshot and sponsor line. */
  variant?: 'full' | 'band';
  source?: string;
};

const NewsletterBannerFancy: React.FC<NewsletterBannerFancyProps> = ({
  variant = 'full',
  source = 'newsletter-banner-fancy',
}) => {
  const band = variant === 'band';

  return (
    <section
      aria-label="Subscribe to Tiny Improvements"
      className={clsxm(
        'bg-tint-pink relative w-full pt-3',
        !band && 'mx-auto max-w-3xl'
      )}
    >
      <div
        aria-hidden
        className="riso-halftone absolute inset-x-0 top-0 h-3 [background-size:6px_6px]"
      />
      <div
        className={clsxm(
          band
            ? 'grid items-center gap-x-12 gap-y-6 p-6 md:grid-cols-[1fr_1.1fr] md:p-8'
            : 'flex flex-col gap-4 px-6 py-10 sm:px-12'
        )}
      >
        <div className="flex min-w-0 flex-col gap-3">
          {!band && (
            <Headshot size={72} className="h-[72px] w-[72px] object-cover" />
          )}
          <h2
            className={clsxm(
              'text-ink m-0 text-balance font-futura font-bold leading-tight',
              band ? 'text-2xl md:text-3xl' : 'text-3xl sm:text-4xl'
            )}
          >
            💌 Tiny Improvements
          </h2>
          <p className="m-0 text-pretty font-serif text-lg leading-snug">
            {config.newsletter.shortDescription} Join{' '}
            <strong className="text-riso-pink font-futura">
              <SubscriberCount /> other builders
            </strong>
            .
          </p>
        </div>
        <div className="flex min-w-0 flex-col gap-3">
          <SubscriptionForm source={source} />
          <p className="text-ink-muted m-0 font-serif text-sm">
            Once a week, straight from me to you.{' '}
            <span role="img" aria-label="kissy face">
              😘
            </span>{' '}
            Unsubscribe anytime.
          </p>
          {!band && <SponsorCTA />}
        </div>
      </div>
    </section>
  );
};

export default NewsletterBannerFancy;
