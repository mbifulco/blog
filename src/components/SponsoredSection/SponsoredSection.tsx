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
    <div className="overflow-x-hidden md:overflow-x-visible">
      <section
        className={clsxm(
          'sponsored-section text-md my-4 flex flex-col rounded-sm border border-solid px-8 py-4',
          'before:height-[3px] before:width-[33%] before:background-pink-400 before:position-relative before:top-[calc(-1em_-_3px)] before:ml-auto before:mr-auto before:content-["_"]',
          'after:height-[3px] after:width-[33%] after:background-pink-400 after:position-relative after:top-[calc(-1em_-_3px)] after:ml-auto after:mr-auto after:content-["_"]'
        )}
      >
        <Link
          className="thank-you block text-sm uppercase text-gray-500"
          href="/sponsor"
          target="_blank"
        >
          Thank you <span className="text-bold">{sponsorName}</span> for
          sponsoring
        </Link>
        <div className="grid grid-cols-[192px_1fr] gap-4">
          {imagePublicId && (
            <Link
              href={href}
              target="_blank"
              className="h-[192px] w-[192px] flex-grow"
            >
              <Image
                publicId={imagePublicId}
                alt={`Sponsored by ${sponsorName}`}
                className="inline-block h-auto w-full"
              />
            </Link>
          )}

          <div className="block">
            {children}

            <div className="flex flex-col content-center gap-4">
              <Link
                className="self-center rounded bg-pink-600 px-4 py-2 text-white no-underline hover:bg-pink-700 hover:text-white hover:no-underline active:bg-blue-800"
                href={href}
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
