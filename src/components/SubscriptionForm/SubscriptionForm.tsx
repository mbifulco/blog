import { useEffect, useRef, useState } from 'react';
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
  const [formLoadedAt, setFormLoadedAt] = useState<number | null>(null);

  // Record when the form loads - bots submit instantly, humans take time
  useEffect(() => {
    setFormLoadedAt(Date.now());
  }, []);

    const addSubscriberMutation = trpc.mailingList.subscribe.useMutation({
    onSuccess: (data: SubscribeMutationResponse) => {
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
          toast.error('Invalid email address', {
            description: 'Please enter a valid email address (e.g., person@gmail.com)',
          });
        } else if (fieldErrors.firstName) {
          toast.error('Missing first name', {
            description: 'Please enter your first name',
          });
        } else {
          toast.error('Validation error', {
            description: 'Please check your input and try again',
          });
        }
      } else if (errorData?.message) {
        toast.error('Subscription failed', {
          description: errorData.message,
        });
      } else {
        toast.error('Something went wrong', {
          description: 'Please try again or contact support.',
        });
      }

      posthog.capture('newsletter/subscribe_error', {
        source,
        email,
        firstName,
        error: errorData?.message || 'Unknown error',
      });

      // Don't clear form values on error - let user fix their input
    },
  });

  const { refreshStats } = useNewsletterStats();

  const formRef = useRef<HTMLFormElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const firstNameRef = useRef<HTMLInputElement>(null);
  const honeypotRef = useRef<HTMLInputElement>(null);

      // Validation helper: detect suspicious first names
  const isSpamFirstName = (name: string | undefined): boolean => {
    if (!name || name.length === 0) return false;

    // Check for mixed case pattern (e.g., VKvNcRvi, mtpDQVeZaqb)
    const hasMixedCase = /[a-z]/.test(name) && /[A-Z]/.test(name);
    const hasMultipleUpperInMiddle = /[a-z][A-Z]/.test(name);

    // Check for excessive uppercase letters in mixed case names
    // Split by spaces and check each word
    const words = name.split(/\s+/);
    const hasExcessiveUppercase = words.some((word) => {
      const uppercaseCount = (word.match(/[A-Z]/g) || []).length;
      const hasMixed = /[a-z]/.test(word) && /[A-Z]/.test(word);
      return hasMixed && uppercaseCount > 2;
    });

    // Check for excessive consonants (>4 in a row)
    const hasExcessiveConsonants = /[bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ]{5,}/.test(name);

    // Check vowel ratio (should have at least 20% vowels in a normal name)
    const vowelCount = (name.match(/[aeiouAEIOU]/g) || []).length;
    const vowelRatio = vowelCount / name.length;
    const hasLowVowelRatio = vowelRatio < 0.2 && name.length > 4;

    return (hasMixedCase && hasMultipleUpperInMiddle) || hasExcessiveConsonants || hasLowVowelRatio || hasExcessiveUppercase;
  };

  const handleSubmission = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const email = emailRef.current?.value;
    const firstName = firstNameRef.current?.value;
    const honeypot = honeypotRef.current?.value;

    if (honeypot) {
      posthog.capture('newsletter/spam_detected', {
        source,
        email,
        firstName,
        reason: 'honeypot',
        honeypotValue: honeypot,
      });
      setGetHoneypottedNerd(true);
      return;
    }

    // Check for spam patterns in first name
    if (isSpamFirstName(firstName)) {
      posthog.capture('newsletter/spam_detected', {
        source,
        email,
        firstName,
        reason: 'suspicious_first_name',
      });
      setGetHoneypottedNerd(true);
      return;
    }

    if (!email) {
      toast.error('Missing email', {
        description: 'Please enter your email address',
        duration: 5000,
      });
      return;
    }

    // Basic email validation on frontend
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Invalid email address', {
        description: 'Please enter a valid email address (e.g., person@gmail.com)',
        duration: 5000,
      });
      return;
    }

    posthog.identify(email, {
      firstName,
    });

    posthog.capture('newsletter/attempting_subscribe', {
      source,
      email,
      firstName,
    });

    addSubscriberMutation.mutate({
      email,
      firstName,
      honeypot: honeypot || undefined,
      formLoadedAt: formLoadedAt ?? undefined,
    });
  };



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
                aria-label="Website"
                ref={honeypotRef}
                style={{ display: 'none' }}
                name="website"
                tabIndex={-1}
                autoComplete="off"
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
                className="h-10 w-full grow rounded-none border border-b-0 border-solid border-pink-600 bg-white px-[2ch] py-[1ch] font-normal text-gray-950"
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
