import Link from 'next/link';

import clsxm from '@utils/clsxm';
import { Image } from '../Image';

type SponsoredSectionProps = {
  CTAtext: string;
  sponsorName: string;
  href: string;
  imagePublicId?: string;
  brandColor?: string;
  children: React.ReactNode;
};

const SponsoredSection: React.FC<SponsoredSectionProps> = ({
  children,
  CTAtext,
  sponsorName,
  href,
  imagePublicId,
  brandColor = '#db2777', // pink-600 default
}) => {
  return (
    <div className="overflow-x-hidden pb-4 md:overflow-x-visible">
      {/* Top colophon */}
      <div className="grid grid-cols-3">
        <span />
        <div className="flex flex-col items-center gap-2">
          <div className="flex flex-row items-center justify-evenly gap-4 text-4xl text-gray-300">
            <span>*</span>
            <span>*</span>
            <span>*</span>
          </div>
        </div>
        <span />
      </div>

      <Link
        className="thank-you block px-4 pb-1 text-xs uppercase italic text-gray-400 no-underline"
        href="/sponsor"
        target="_blank"
        // see: https://developers.google.com/search/docs/essentials/spam-policies#link-spam
      >
        Thanks to <span className="text-bold">{sponsorName}</span> for
        sponsoring
      </Link>

      <section className={clsxm('sponsored-section mx-4 flex flex-col')}>
        {imagePublicId && (
          <div className="not-prose overflow-hidden rounded-md">
            <Link href={href} target="_blank" rel="sponsored">
              <Image
                bare
                publicId={imagePublicId}
                alt={`Sponsored by ${sponsorName}`}
                className="my-0 inline-block h-auto w-full"
              />
            </Link>
          </div>
        )}

        <div
          className={clsxm(
            'prose block py-4 prose-headings:mb-1 prose-headings:mt-0 prose-p:my-2',
            imagePublicId ? 'prose-xs' : 'prose-sm',
            '[&_h3]:text-(--brand-color)! [&_h4]:text-(--brand-color)! [&_h5]:text-(--brand-color)!'
          )}
          style={
            {
              '--brand-color': brandColor,
            } as React.CSSProperties
          }
        >
          {children}

          <div className="flex flex-col content-center gap-4">
            <Link
              className="self-center rounded-md px-6 py-2.5 text-sm font-medium text-white no-underline transition-all hover:text-white hover:no-underline"
              style={{
                backgroundColor: brandColor,
                borderColor: brandColor,
                border: '1px solid',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '0.9';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '1';
              }}
              href={href}
              rel="sponsored"
            >
              {CTAtext}
            </Link>
          </div>
        </div>
      </section>

      {/* Bottom colophon */}
      <div className="grid grid-cols-3">
        <span />
        <div className="flex flex-col items-center gap-2">
          <div className="flex flex-row items-center justify-evenly gap-4 text-4xl text-gray-300">
            <span>*</span>
            <span>*</span>
            <span>*</span>
          </div>
        </div>
        <span />
      </div>
    </div>
  );
};

export default SponsoredSection;
