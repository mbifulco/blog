import posthog from 'posthog-js';

import Link from '@components/Link';
import { Image } from '../Image';

type SponsorPlacement = 'logo' | 'image' | 'cta';

type SponsoredSectionProps = {
  CTAtext: string;
  sponsorName: string;
  href: string;
  imagePublicId?: string;
  /** Printed on the deep blue band, so it must be a version made for dark grounds */
  logoPublicId?: string;
  children: React.ReactNode;
};

const SponsoredSection: React.FC<SponsoredSectionProps> = ({
  children,
  CTAtext,
  sponsorName,
  href,
  imagePublicId,
  logoPublicId,
}) => {
  const trackClick = (placement: SponsorPlacement) => () => {
    posthog.capture('sponsor_link_clicked', {
      sponsor: sponsorName,
      href,
      placement,
    });
  };

  return (
    <aside
      aria-label={`Sponsored by ${sponsorName}`}
      className="not-prose bg-blue-fill text-on-fill relative my-12 overflow-hidden"
    >
      <div
        aria-hidden
        className="riso-halftone absolute inset-x-0 top-0 h-3 mix-blend-normal [background-size:6px_6px]"
      />

      <div className="flex flex-col gap-5 px-5 pb-7 pt-8 sm:px-8">
        <div className="flex items-center justify-between gap-4">
          {logoPublicId ? (
            <Link
              className="block w-fit no-underline"
              href={href}
              target="_blank"
              rel="sponsored"
              onClick={trackClick('logo')}
            >
              <Image
                bare
                publicId={logoPublicId}
                alt={sponsorName}
                width={176}
                height={40}
                objectFit="contain"
                sizes="176px"
                className="my-0 h-8 w-auto"
              />
            </Link>
          ) : (
            <span className="font-sans text-lg font-bold">{sponsorName}</span>
          )}

          <Link
            className="text-on-fill/75 hover:text-on-fill font-sans text-xs font-bold uppercase tracking-[0.12em] no-underline hover:underline"
            href="/sponsor"
            target="_blank"
            // see: https://developers.google.com/search/docs/essentials/spam-policies#link-spam
          >
            Sponsor
          </Link>
        </div>

        {imagePublicId && (
          <Link
            className="block"
            href={href}
            target="_blank"
            rel="sponsored"
            onClick={trackClick('image')}
          >
            <Image
              bare
              publicId={imagePublicId}
              alt={`Sponsored by ${sponsorName}`}
              className="my-0 block h-auto w-full"
              objectFit="contain"
            />
          </Link>
        )}

        <div className="[&_a]:text-on-fill [&_a]:decoration-riso-pink-bright [&_h3]:text-on-fill [&_p]:text-on-fill/90 [&_h3]:m-0 [&_h3]:text-balance [&_h3]:font-sans [&_h3]:text-2xl [&_h3]:font-bold [&_h3]:leading-tight [&_h3]:tracking-[-0.01em] [&_p]:mb-0 [&_p]:mt-3 [&_p]:max-w-[60ch] [&_p]:text-lg">
          {children}
        </div>

        <Link
          className="bg-pink-fill border-pink-fill text-on-fill hover:bg-on-fill hover:border-on-fill hover:text-blue-fill focus-visible:outline-on-fill inline-flex min-h-11 w-fit items-center border-2 px-4 py-2 font-sans text-[0.8rem] font-bold uppercase tracking-[0.1em] no-underline transition-colors hover:no-underline"
          href={href}
          rel="sponsored"
          onClick={trackClick('cta')}
        >
          {CTAtext}
        </Link>
      </div>
    </aside>
  );
};

export default SponsoredSection;
