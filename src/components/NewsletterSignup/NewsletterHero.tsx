/**
 * v0 by Vercel.
 * @see https://v0.dev/t/kB60c2A2FTB
 */

import Image from 'next/image';
import useConvertKitStats from '@hooks/useConvertKitStats';

import Button from '@components/Button';
import Input from '@components/Forms/Input';
import Label from '@components/Forms/Label';

const NewsletterHero = () => {
  const { stats } = useConvertKitStats();

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
          <Image
            alt="Newsletter"
            className="aspect-content mx-auto overflow-hidden rounded-xl object-cover object-center sm:w-full"
            height="400"
            src="/placeholder.svg"
            width="400"
          />
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                💌 Tiny Improvements Newsletter
              </h1>
              <p className="max-w-[600px] text-gray-700 md:text-xl">
                Join the{' '}
                <span className="text-bold text-pink-600">
                  {stats?.subscriberCount ?? (
                    <span>
                      <i role="img" aria-label="fire">
                        🔥
                      </i>{' '}
                      {stats?.subscriberCount}
                    </span>
                  )}{' '}
                  other product builders
                </span>{' '}
                readers getting tiny improvements in their inbox every week.
              </p>
              <p className="max-w-[600px] text-gray-500 md:text-xl">
                Our newsletter brings you the best tips and tricks for
                productivity, self-improvement, and personal growth.
              </p>
            </div>
            <div className="w-full max-w-sm space-y-2">
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="first-name">First Name</Label>
                  <Input id="first-name" required />
                </div>
                <div className="space-y-2">
                  <Input
                    id="email"
                    placeholder="m@example.com"
                    required
                    type="email"
                  />
                </div>
                <Button className="w-full" type="submit">
                  Sign Up
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterHero;
