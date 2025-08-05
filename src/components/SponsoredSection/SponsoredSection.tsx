import Link from 'next/link';

import clsxm from '@utils/clsxm';
import { Image } from '../Image';

type SponsoredSectionProps = {
  CTAtext: string;
  sponsorName: string;
  href: string;
  imagePublicId?: string;
  children: React.ReactNode;
};

const SponsoredSection: React.FC<SponsoredSectionProps> = ({
  children,
  CTAtext,
  sponsorName,
  href,
  imagePublicId,
}) => {
  return (
    <div className="overflow-x-hidden pb-8 md:overflow-x-visible">
      <Link
        className="thank-you mb-1 block text-sm text-gray-600 uppercase italic no-underline"
        href="/sponsor"
        target="_blank"
        // see: https://developers.google.com/search/docs/essentials/spam-policies#link-spam
      >
        Thanks to <span className="text-bold">{sponsorName}</span> for
        sponsoring
      </Link>
      <section
        className={clsxm(
          'sponsored-section text-md mt-1 flex flex-col rounded-xs border border-solid border-pink-300 bg-pink-50/50 p-4',
          'before:height-[3px] before:width-[33%] before:background-pink-400 before:position-relative before:top-[calc(-1em_-_3px)] before:mr-auto before:ml-auto before:content-["_"]',
          'after:height-[3px] after:width-[33%] after:background-pink-400 after:position-relative after:top-[calc(-1em_-_3px)] after:mr-auto after:ml-auto after:content-["_"]'
        )}
      >
        <div className="flex flex-col space-y-4">
          <div className="not-prose">
            {imagePublicId && (
              <Link href={href} target="_blank" rel="sponsored">
                <Image
                  bare
                  publicId={imagePublicId}
                  alt={`Sponsored by ${sponsorName}`}
                  className="my-0 inline-block h-auto w-full"
                />
              </Link>
            )}
          </div>

          <div className="prose block">
            {children}

            <div className="flex flex-col content-center gap-4">
              <Link
                className="self-center rounded-sm bg-pink-600 px-4 py-2 text-white no-underline hover:bg-pink-700 hover:text-white hover:no-underline active:bg-blue-800"
                href={href}
                rel="sponsored"
              >
                {CTAtext}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SponsoredSection;
