import { useState } from 'react';

import { Heading } from '@components/Heading';

const ResendNewsletterSignup = () => {
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subscribeToNewsletter = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = e.currentTarget?.email?.value as string;
    const firstName = e.currentTarget?.firstName?.value as string;

    const res = await fetch('/api/email/subscribe', {
      body: JSON.stringify({
        email,
        firstName,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });

    const json = (await res.json()) as { message: string };

    if (!res.ok) {
      setError(json.message);
      return;
    }

    setError(null);
    setSubscribed(true);
    console.log('response from api route is', json);

    // TODO: Send to API route
  };

  return (
    <div className="bg-gray-900 py-16 sm:py-24 lg:py-32">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 lg:grid-cols-12 lg:gap-8 lg:px-8">
        <div className="flex max-w-xl flex-col gap-4 text-white lg:col-span-7">
          <h2 className="inline font-bold uppercase tracking-tight  sm:block sm:text-4xl lg:inline lg:text-3xl xl:block xl:text-6xl">
            Ship Products
            <br /> that <span className="text-pink-700">Matter</span>.
          </h2>{' '}
          <p className="inline tracking-normal sm:block lg:inline xl:block">
            💌 Tiny Improvements: my weekly newsletter sharing one small yet
            impactful idea for product builders, startup founders, and
            indiehackers.
          </p>
          <p className="inline tracking-normal sm:block lg:inline xl:block">
            It&apos;s your cheat code for building products your customers will
            love. Learn from the CTO of a Y Combinator-backed startup, with past
            experience at Google, Stripe, and Microsoft.
          </p>
        </div>
        <form
          className="relative flex w-full max-w-md flex-col justify-center lg:col-span-5 lg:pt-2"
          onSubmit={subscribeToNewsletter}
        >
          {!subscribed && (
            <>
              <fieldset
                disabled={subscribed}
                className="disabled:cursor-not-allowed disabled:opacity-50"
              >
                <div className="flex flex-wrap gap-4">
                  <div className="flex flex-row gap-4">
                    <label htmlFor="email-address" className="sr-only">
                      First Name
                    </label>
                    <input
                      id="email-address"
                      name="firstName"
                      type="text"
                      autoComplete="email"
                      required
                      className="shrink-1 min-w-0 max-w-[14ch] flex-auto flex-shrink rounded-md border-0 bg-white/5 px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                      placeholder="John"
                      defaultValue={'John'}
                    />
                    <label htmlFor="email-address" className="sr-only">
                      Email address
                    </label>
                    <input
                      id="email-address"
                      name="email"
                      type="email"
                      autoComplete="email"
                      // required
                      className="min-w-0 flex-auto rounded-md border-0 bg-white/5 px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                      placeholder="Enter your email"
                      defaultValue={'hello@example.com'}
                    />
                  </div>
                  <button
                    type="submit"
                    className="flex-none rounded-md bg-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                  >
                    Subscribe
                  </button>
                </div>
              </fieldset>
              <p className="mt-2 text-sm text-red-500">{error && error}</p>
              <p className="mt-4 text-sm leading-6 text-gray-300">
                No spam, ever. Unsubscribe any time.
              </p>
            </>
          )}
          {subscribed && (
            <>
              <Heading as="h3">🚀 Success! Thanks for subscribing!</Heading>
              <p className="text-md bg-gray-900 font-bold leading-normal text-white">
                Please check your inbox &amp; spam folder to confirm your
                subscription.
              </p>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default ResendNewsletterSignup;
