/**
 * v0 by Vercel.
 * @see https://v0.dev/t/kB60c2A2FTB
 */

import useConvertKitStats from '@hooks/useConvertKitStats';

import { Heading } from '@components/Heading';
import { Image } from '@components/Image';
import { SubscriptionForm } from '@components/SubscriptionForm';

const NewsletterHero = () => {
  const { stats } = useConvertKitStats();

  return (
    <section
      className="-ml-4 w-screen bg-gray-950 py-0"
      style={{ backgroundImage: `url(/images/wiggle.svg)` }}
    >
      <div className="m-4 sm:m-20 lg:m-0">
        <div className="flex flex-col-reverse items-center justify-center gap-6 lg:flex-row lg:gap-12">
          <Image
            publicId="newsletters/hero-images/washed-up"
            alt="Washed up, as always"
            className="mx-auto hidden aspect-square overflow-hidden object-cover object-left py-10 sm:w-full lg:block"
            height={898}
            width={1600}
          />
          <div className="text-md flex flex-col items-center justify-center gap-10 lg:pr-12 xl:text-xl">
            <div className="relative max-w-prose space-y-4 overflow-visible rounded text-gray-300">
              <div className="absolute -top-4 left-4 z-0 block h-full w-full bg-[hsl(3,90%,55%)] mix-blend-screen" />
              {/* <div className="absolute left-0 top-0 z-0 block h-full w-full  bg-[hsl(113,90%,55%)] mix-blend-screen" /> */}
              <div className="absolute -left-4 top-4 z-0 block h-full w-full bg-[hsl(223,90%,55%)] mix-blend-screen" />
              <div className="relative z-20 flex h-full w-full flex-col gap-4 bg-[#222] p-6">
                <Heading
                  as="h2"
                  className="lg-text-2xl text-white xl:text-7xl"
                  id="newsletter-signup"
                >
                  SHIP PRODUCTS <br />
                  THAT <span className="text-pink-600">MATTER</span>
                </Heading>
                <p>
                  💌 Tiny Improvements: my weekly newsletter sharing one small
                  yet impactful idea for product builders, startup founders, and
                  indiehackers.
                </p>
                <p>
                  It&apos;s your cheat code for building products your customers
                  will love. Learn from the CTO of a Y Combinator-backed
                  startup, with past experience at Google, Stripe, and
                  Microsoft.
                </p>
                <div className="block w-full space-y-2">
                  <SubscriptionForm />
                  <p className="max-w-[600px] text-lg text-gray-300">
                    Join{' '}
                    <span className="text-pink-400">
                      {stats?.subscriberCount ? (
                        <span>{stats?.subscriberCount}</span>
                      ) : (
                        'the'
                      )}{' '}
                      other product builders
                    </span>
                    {', '}
                    and start shipping today!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterHero;
