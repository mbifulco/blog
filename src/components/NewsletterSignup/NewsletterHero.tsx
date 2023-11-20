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
    <section className="lg:py-30 w-full bg-gray-700 py-8 text-white md:py-24 xl:py-56">
      <div className="px-0">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
          <Image
            publicId="newsletters/hero-images/washed-up"
            alt="Washed up, as always"
            className="mx-auto aspect-square overflow-hidden object-cover object-left sm:w-full"
            height={898}
            width={1600}
          />
          <div className="flex flex-col justify-center gap-10  md:text-xl lg:pr-12 xl:text-2xl">
            <div className="max-w-prose space-y-4 text-gray-300">
              <Heading
                as="h2"
                className="text-white xl:text-7xl"
                id="newsletter-signup"
              >
                SHIP PRODUCTS <br />
                THAT <span className="text-pink-600">MATTER</span>
              </Heading>
              <p>
                💌 Tiny Improvements: my weekly newsletter sharing one small yet
                impactful idea for product builders, startup founders, and
                indiehackers.
              </p>
              <p>
                It&apos;s your cheat code for building products your customers
                will love. Learn from the CTO of a Y Combinator-backed startup,
                with past experience at Google, Stripe, and Microsoft.
              </p>
            </div>
            <div className="w-full space-y-2">
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
    </section>
  );
};

export default NewsletterHero;
