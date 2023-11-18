import Link from 'next/link';

import { Image } from '../Image';
import clsx from 'clsx';

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
        className={clsx(
          'sponsored-section border border-solid border-gray-300 rounded-sm -mx-8 my-4 px-8 py-4 text-md',
          'before:top-[calc(-1em_-_3px)] before:content-["_"] before:height-[3px] before:width-[33%] before:background-pink-400 before:position-relative before:ml-auto before:mr-auto',
          'after:top-[calc(-1em_-_3px)] after:content-["_"] after:height-[3px] after:width-[33%] after:background-pink-400 after:position-relative after:ml-auto after:mr-auto'
        )}
      >
        <Link
          className="thank-you uppercase text-gray-500 text-sm block mb-[2ch]"
          href="/sponsor"
          target="_blank"
        >
          Thanks so much to our sponsor{' '}
          <span className="text-bold">{sponsorName}</span>
        </Link>
        {imagePublicId && (
          <Link href={href} target="_blank">
            <Image
              publicId={imagePublicId}
              alt={`Sponsored by ${sponsorName}`}
            />
          </Link>
        )}

        {children}

        <div className="flex flex-col gap-4 content-center">
          <Link
            className="rounded bg-blue-600 text-white hover:no-underline hover:bg-blue-700 active:bg-blue-800 hover:text-white py-2 px-4 self-center"
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
