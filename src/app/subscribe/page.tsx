'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import posthog from 'posthog-js';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import SubscriberCount from '@components/NewsletterSignup/SubscriberCount';
import { Button } from '@ui/button';
import { Card, CardContent, CardHeader } from '@ui/card';
import { Input } from '@ui/input';
import { Label } from '@ui/label';
import type { SubscribeMutationResponse } from '@server/routers/mailingList';
import { trpc } from '@utils/trpc';
import { PostHogPageview } from '../posthog-provider';

type FormData = {
  firstName: string;
  email: string;
};

export default function NewsletterSignupPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>();

  const addSubscriberMutation = trpc.mailingList.subscribe.useMutation({
    onSuccess: (data: SubscribeMutationResponse) => {
      if (data?.error?.name === 'already_subscribed') {
        toast.success('Already subscribed! 🎉', {
          description: data.error.message,
          duration: 5000,
        });

        posthog.capture('newsletter/already_subscribed', {
          source: 'subscribe-page',
        });

        reset();
        return;
      }

      setIsSubmitted(true);

      toast.success('Successfully subscribed! 🪩', {
        description: `Thanks for subscribing! Check your inbox for emails from hello@mikebifulco.com`,
        duration: 5000,
        position: 'top-center',
      });

      posthog.capture('newsletter/subscribed', {
        source: 'subscribe-page',
      });

      reset();
    },
    onError: (error) => {
      toast.error('Subscription failed', {
        description:
          'Please try again or contact hello@mikebifulco.com for help.',
        duration: 5000,
      });

      posthog.capture('newsletter/subscribe_error', {
        source: 'subscribe-page',
        error,
      });
    },
  });

  const onSubmit = (data: FormData) => {
    posthog.identify(data.email, {
      firstName: data.firstName,
    });

    addSubscriberMutation.mutate({
      email: data.email,
      firstName: data.firstName,
    });
  };

  if (isSubmitted) {
    return (
      <>
        <PostHogPageview />
        <div className="flex min-h-screen items-center justify-center p-4">
          <Card className="w-full max-w-md bg-white">
            <CardContent className="bg-white pt-6">
              <div className="flex flex-col gap-4">
                <h1
                  className="text-2xl font-bold text-gray-900"
                  data-testid="success-title"
                >
                  🪩 Success! You&apos;re in!
                </h1>
                <p
                  className="bg-white text-gray-600"
                  data-testid="success-message"
                >
                  Thanks so much for subscribing. Don&apos;t forget to check
                  your spam folder for emails from{' '}
                  <span className="font-medium text-pink-600">
                    hello@mikebifulco.com
                  </span>
                </p>
                <Button
                  asChild
                  variant="outline"
                  className="mt-4"
                  data-testid="read-latest-button"
                >
                  <Link href="/newsletter">Read the latest dispatch</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <PostHogPageview />
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white">
          <CardHeader className="pb-4 text-left">
            <header className="flex flex-col gap-1 text-left">
              <h1
                className="mb-1 text-3xl font-bold text-balance text-pink-600"
                data-testid="newsletter-title"
              >
                Join{' '}
                <span className="text-pink-600">
                  <SubscriberCount />
                </span>{' '}
                devs &amp; founders building better.
              </h1>
              <p
                className="text-muted-foreground mb-2 text-lg"
                data-testid="newsletter-description"
              >
                One sharp idea each week to help you ship smarter and faster.
              </p>
            </header>
          </CardHeader>

          <CardContent>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4"
              noValidate
            >
              <fieldset className="flex flex-col gap-2">
                <div>
                  <Label htmlFor="firstName" className="sr-only">
                    First Name
                  </Label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="First Name"
                    data-testid="first-name-input"
                    {...register('firstName', {
                      required: 'First name is required',
                    })}
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="email" className="sr-only">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    data-testid="email-input"
                    {...register('email', {
                      required: 'Email is required',
                    })}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </fieldset>

              <Button
                type="submit"
                variant={'default'}
                className="w-full"
                data-testid="submit-button"
                disabled={isSubmitting || addSubscriberMutation.isPending}
              >
                {isSubmitting || addSubscriberMutation.isPending
                  ? 'Subscribing...'
                  : '💌 Get the newsletter'}
              </Button>
            </form>
            <div className="mt-4 flex flex-row justify-start gap-4 rounded-sm bg-gray-100 p-4">
              <Image
                src="/images/mike-headshot-square.png"
                alt="Mike Bifulco"
                width={60}
                height={60}
                className="rounded-full"
              />
              <div className="flex flex-col">
                <p className="text-foreground text-sm">💌 Tiny Improvements</p>
                <p className="text-muted-foreground text-sm font-medium">
                  <span className="font-normal">by</span> Mike Bifulco
                </p>
                <p className="text-muted-foreground text-sm">
                  YC founder. Ex-Stripe, Google, Microsoft.
                </p>
              </div>
            </div>

            <div className="mt-2 text-xs text-gray-500">
              <p>
                <Link
                  href="/integrity"
                  className="text-xs text-gray-500"
                  data-testid="privacy-link"
                >
                  I&apos;ll never sell your contact info.
                </Link>{' '}
                <span
                  className="font-medium text-pink-600"
                  data-testid="unsubscribe-text"
                >
                  Unsubscribe any time.
                </span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
