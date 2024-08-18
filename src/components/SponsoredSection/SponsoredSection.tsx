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
          'sponsored-section text-md -mx-4 my-4 rounded-sm border border-solid px-8 py-4',
          'before:height-[3px] before:width-[33%] before:background-pink-400 before:position-relative before:top-[calc(-1em_-_3px)] before:ml-auto before:mr-auto before:content-["_"]',
          'after:height-[3px] after:width-[33%] after:background-pink-400 after:position-relative after:top-[calc(-1em_-_3px)] after:ml-auto after:mr-auto after:content-["_"]'
        )}
      >
        <Link
          className="thank-you mb-[2ch] block text-sm uppercase text-gray-500"
          href="/sponsor"
          target="_blank"
        >
          Thank you <span className="text-bold">{sponsorName}</span> for
          sponsoring
        </Link>
        {imagePublicId && (
          <Link href={href} target="_blank">
            <Image
              publicId={imagePublicId}
              alt={`Sponsored by ${sponsorName}`}
              className="h-48 w-48"
            />
          </Link>
        )}

        {children}

        <div className="flex flex-col content-center gap-4">
          <Link
            className="self-center rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 hover:text-white hover:no-underline active:bg-blue-800"
            href={href}
          >
            {CTAtext}
          </Link>
        </div>
      </section>
    </div>
  );
};

export default SponsoredSection;
