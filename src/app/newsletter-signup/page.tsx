'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'sonner';
import posthog from 'posthog-js';

import { PostHogPageview } from '../posthog-provider';

import { Button } from '@ui/button';
import { Input } from '@ui/input';
import { Label } from '@ui/label';
import { Card, CardContent, CardHeader } from '@ui/card';
import { trpc } from '../trpc-provider';

type FormData = {
  firstName: string;
  email: string;
};

export default function NewsletterSignupPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FormData>();

  const addSubscriberMutation = trpc.mailingList.subscribe.useMutation({
    onSuccess: (data) => {
      if (data?.error?.name === 'already_subscribed') {
        toast.success('Already subscribed! 🎉', {
          description: data.error.message,
          duration: 5000,
        });

        posthog.capture('newsletter/already_subscribed', {
          source: 'newsletter-signup-page',
        });

        return;
      }

      setIsSubmitted(true);
      reset();

      toast.success('Successfully subscribed! 🪩', {
        description: `Thanks for subscribing! Check your inbox for emails from hello@mikebifulco.com`,
        duration: 5000,
        position: 'top-center',
      });

      posthog.capture('newsletter/subscribed', {
        source: 'newsletter-signup-page',
      });
    },
    onError: (error) => {
      toast.error('Subscription failed', {
        description: 'Please try again or contact hello@mikebifulco.com for help.',
        duration: 5000,
      });

      posthog.capture('newsletter/subscribe_error', {
        source: 'newsletter-signup-page',
        error,
      });
    },
  });

  const onSubmit = async (data: FormData) => {
    posthog.identify(data.email, {
      firstName: data.firstName,
    });

    await addSubscriberMutation.mutateAsync({
      email: data.email,
      firstName: data.firstName,
    });
  };

  if (isSubmitted) {
    return (
      <>
        <PostHogPageview />
        <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#212F4F' }}>
          <Card className="w-full max-w-md text-center bg-white">
            <CardContent className="pt-6 bg-white">
              <div className="flex flex-col gap-4">
                <h1 className="text-2xl font-bold text-gray-900">🪩 Success!</h1>
                <p className="text-gray-600 bg-white">
                  Thanks so much for subscribing. Don&apos;t forget to check your spam folder for emails from{' '}
                  <span className="text-pink-600 font-medium">hello@mikebifulco.com</span>
                </p>
                <Button
                  onClick={() => setIsSubmitted(false)}
                  variant="outline"
                  className="mt-4"
                >
                  Subscribe Another Email
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
      <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#212F4F' }}>
        <Card className="w-full max-w-md bg-white ">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              <Image
                src="/images/mike-headshot-square.png"
                alt="Mike Bifulco"
                width={60}
                height={60}
                className="rounded-full"
              />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Get the newsletter</h1>
            <h2 className="text-xl font-semibold mb-1 text-pink-600">
              💌 Tiny Improvements
            </h2>
            <p className="text-gray-600">Straight to your inbox, once a week</p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="firstName" className="sr-only">First Name</Label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="First Name"
                  {...register('firstName', { required: 'First name is required' })}
                />
                {errors.firstName && (
                  <p className="text-sm text-red-600 mt-1">{errors.firstName.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="email" className="sr-only">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Email Address"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Please enter a valid email address'
                    }
                  })}
                />
                {errors.email && (
                  <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
                )}
              </div>

              <Button
                type="submit"
                variant={"default"}
                className="w-full"
                disabled={isSubmitting || addSubscriberMutation.isPending}
              >
                {isSubmitting || addSubscriberMutation.isPending ? 'Subscribing...' : '💌 Subscribe'}
              </Button>
            </form>

            <p className="text-sm text-gray-500 text-center mt-6">
              I&apos;ll never sell your contact info.{' '}
              <Link href="/newsletter" className="text-pink-600 hover:underline">
                Unsubscribe at any time.
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
