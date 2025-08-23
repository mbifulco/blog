import { useRef, useState } from 'react';
import useNewsletterStats from '@hooks/useNewsletterStats';
import posthog from 'posthog-js';
import { toast } from 'sonner';

import Button from '@components/Button';
import { Input } from '@ui/input';
import { trpc } from '@utils/trpc';
import type { SubscribeMutationResponse } from '@server/routers/mailingList';

type SubscriptionFormProps = {
  tags?: string[];
  source?: string;
  buttonText?: string;
};

const SubscriptionForm: React.FC<SubscriptionFormProps> = ({
  tags: _,
  source,
  buttonText = 'Subscribe',
}) => {
  const [getHoneypottedNerd, setGetHoneypottedNerd] = useState<boolean>(false);
  const [alreadySubscribed, setAlreadySubscribed] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const addSubscriberMutation = trpc.mailingList.subscribe.useMutation({
    onSuccess: (data: SubscribeMutationResponse) => {
      // Clear any validation errors on success
      setValidationError(null);

      // Check if this is the "already subscribed" case
      if (data.error?.name === 'already_subscribed') {
        const email = emailRef.current?.value;
        const firstName = firstNameRef.current?.value;

        setAlreadySubscribed(true);

        // Clear the form for potential different email entry
        if (emailRef.current) emailRef.current.value = '';
        if (firstNameRef.current) firstNameRef.current.value = '';

        toast.success('Already subscribed! 🎉', {
          description: data.error.message,
          duration: 5000,
        });

        posthog.capture('newsletter/already_subscribed', {
          source,
          email,
          firstName,
        });

        // Reset state after a brief delay so user can try with different email
        setTimeout(() => {
          setAlreadySubscribed(false);
        }, 100);

        return;
      }

      // Normal successful subscription
      refreshStats();

      const email = emailRef.current?.value;
      const firstName = firstNameRef.current?.value;

      toast.success('Successfully subscribed! 🪩', {
        description: `Thanks for subscribing! Check your inbox for emails from hello@mikebifulco.com`,
        duration: 5000,
        position: 'top-center',
      });

      posthog.capture('newsletter/subscribed', {
        source,
        email,
        firstName,
      });
    },
    onError: (error) => {
      const email = emailRef.current?.value;
      const firstName = firstNameRef.current?.value;

      // Handle validation errors specifically
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const errorData = error as any;
      if (errorData?.data?.zodError?.fieldErrors) {
        const fieldErrors = errorData.data.zodError.fieldErrors;
        if (fieldErrors.email) {
          setValidationError('Please enter a valid email address (e.g., person@gmail.com)');
        } else if (fieldErrors.firstName) {
          setValidationError('Please enter your first name');
        } else {
          setValidationError('Please check your input and try again');
        }
      } else if (errorData?.message) {
        setValidationError(errorData.message);
      } else {
        setValidationError('Something went wrong. Please try again or contact support.');
      }

      toast.error('Subscription failed', {
        description: 'Please check your input and try again.',
        duration: 5000,
      });

      posthog.capture('newsletter/subscribe_error', {
        source,
        email,
        firstName,
        error: errorData?.message || 'Unknown error',
      });
    },
  });

  const { refreshStats } = useNewsletterStats();

  const formRef = useRef<HTMLFormElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const firstNameRef = useRef<HTMLInputElement>(null);
  const honeypotRef = useRef<HTMLInputElement>(null);

    const handleSubmission = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Clear any previous validation errors
    setValidationError(null);

    const email = emailRef.current?.value;
    const firstName = firstNameRef.current?.value;
    const honeypot = honeypotRef.current?.value;

    if (honeypot) {
      setGetHoneypottedNerd(true);
      return;
    }

    if (!email) {
      setValidationError('Please enter your email address');
      return;
    }

    // Basic email validation on frontend
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setValidationError('Please enter a valid email address (e.g., person@gmail.com)');
      return;
    }

    posthog.identify(email, {
      firstName,
    });

    addSubscriberMutation.mutate({
      email,
      firstName,
    });
  };

  // Show validation error inline with the form
  if (validationError) {
    return (
      <div className="flex flex-col gap-2">
        <div className="rounded-md border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-medium text-red-800">
            {validationError}
          </p>
        </div>
        <form ref={formRef} className="w-full" onSubmit={handleSubmission}>
          <fieldset disabled={addSubscriberMutation.isPending}>
            <div data-style="clean">
              <div
                className="seva-fields formkit-fields grid w-full items-center rounded-sm"
                data-element="fields"
                data-stacked="false"
              >
                <Input
                  type="text"
                  aria-label="Last Name"
                  ref={honeypotRef}
                  style={{ display: 'none' }}
                  name="fields[last_name]"
                />
                <Input
                  className="h-10 w-full grow rounded-t rounded-b-none border border-b-0 border-solid border-pink-600 bg-white px-[2ch] py-[1ch] font-normal text-gray-950"
                  aria-label="First Name"
                  name="fields[first_name]"
                  required
                  placeholder="First Name"
                  type="text"
                  ref={firstNameRef}
                />
                <Input
                  className="h-10 w-full grow rounded-b-none rounded-none border border-b-0 border-solid border-pink-600 bg-white px-[2ch] py-[1ch] font-normal text-gray-950"
                  name="email_address"
                  aria-label="Email Address"
                  placeholder="Email Address"
                  required
                  type="email"
                  ref={emailRef}
                />
                <Button
                  type="submit"
                  data-element="submit"
                  className="formkit-submit formkit-submit padding-[1ch 2ch] h-10 grow rounded-t-none rounded-b font-normal"
                >
                  <div className="formkit-spinner">
                    <div></div>
                    <div></div>
                    <div></div>
                  </div>
                  <span>💌 {buttonText}</span>
                </Button>
              </div>
            </div>
          </fieldset>
        </form>
      </div>
    );
  }

  if (
    (addSubscriberMutation.isSuccess && !alreadySubscribed) ||
    getHoneypottedNerd
  ) {
    return (
      <div className="flex flex-col gap-2">
        <p className="text-xl font-semibold text-inherit">
          🪩 Success! Thanks so much for subscribing. Don&apos;t forget to check
          your spam folder for emails from{' '}
          <span className="text-pink-600">hello@mikebifulco.com.</span>
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <form ref={formRef} className="w-full" onSubmit={handleSubmission}>
        <fieldset
          disabled={
            addSubscriberMutation.isPending || addSubscriberMutation.isSuccess
          }
        >
          <div data-style="clean">
            <ul
              className="formkit-alert formkit-alert-error"
              data-element="errors"
              data-group="alert"
            ></ul>
            <div
              className="seva-fields formkit-fields grid w-full items-center rounded-sm"
              data-element="fields"
              data-stacked="false"
            >
              <Input
                type="text"
                aria-label="Last Name"
                ref={honeypotRef}
                style={{ display: 'none' }}
                name="fields[last_name]"
              />
              <Input
                className="h-10 w-full grow rounded-t rounded-b-none border border-b-0 border-solid border-pink-600 bg-white px-[2ch] py-[1ch] font-normal text-gray-950"
                aria-label="First Name"
                name="fields[first_name]"
                required
                placeholder="First Name"
                type="text"
                ref={firstNameRef}
              />
              <Input
                className="h-10 w-full grow rounded-b-none border border-b-0 border-solid border-pink-600 bg-white px-[2ch] py-[1ch] font-normal text-gray-950"
                name="email_address"
                aria-label="Email Address"
                placeholder="Email Address"
                required
                type="email"
                ref={emailRef}
              />
              <Button
                type="submit"
                data-element="submit"
                className="formkit-submit formkit-submit padding-[1ch 2ch] h-10 grow rounded-t-none rounded-b font-normal"
              >
                <div className="formkit-spinner">
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
                <span>💌 {buttonText}</span>
              </Button>
            </div>
          </div>
        </fieldset>
      </form>
    </div>
  );
};

export default SubscriptionForm;
