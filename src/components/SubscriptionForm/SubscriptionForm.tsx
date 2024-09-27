import { get } from 'http';
import { useRef, useState } from 'react';
import Link from 'next/link';
import useNewsletterStats from '@hooks/useNewsletterStats';
import { set } from 'date-fns';
import posthog from 'posthog-js';

import Button from '@components/Button';
import { trpc } from '@utils/trpc';

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
  const addSubscriberMutation = trpc.mailingList.subscribe.useMutation({
    onSuccess: () => {
      refreshStats();

      const email = emailRef.current?.value;
      const firstName = firstNameRef.current?.value;

      posthog.capture('newsletter/subscribed', {
        source,
        email,
        firstName,
      });
    },
    onError: (error) => {
      const email = emailRef.current?.value;
      const firstName = firstNameRef.current?.value;
      posthog.capture('newsletter/subscribe_error', {
        source,
        email,
        firstName,
        error,
      });
    },
  });

  const { refreshStats } = useNewsletterStats();

  const formRef = useRef<HTMLFormElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const firstNameRef = useRef<HTMLInputElement>(null);
  const honeypotRef = useRef<HTMLInputElement>(null);

  const handleSubmission = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const email = emailRef.current?.value;
    const firstName = firstNameRef.current?.value;
    const honeypot = honeypotRef.current?.value;

    if (honeypot) {
      setGetHoneypottedNerd(true);
      return;
    }

    if (!email) {
      return;
    }

    posthog.identify(email, {
      firstName,
    });

    await addSubscriberMutation.mutateAsync({
      email,
      firstName,
    });
  };

  if (addSubscriberMutation.error) {
    return (
      <div className="flex flex-col gap-2">
        <p className="text-xl font-semibold text-inherit">
          {addSubscriberMutation.error.message}
        </p>
        <p className="text-inherit">
          If you continue to have issues, please email{' '}
          <Link
            className="text-pink-600 hover:underline"
            href="mailto:hello@mikebifulco.com"
            rel="noopener noreferrer"
            target="_blank"
          >
            hello@mikebifulco.com
          </Link>{' '}
          and I&apos;ll help get this sorted.
        </p>
      </div>
    );
  }

  if (addSubscriberMutation.isSuccess || getHoneypottedNerd) {
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
              className="seva-fields formkit-fields grid w-full items-center rounded"
              data-element="fields"
              data-stacked="false"
            >
              <input
                type="text"
                aria-label="Last Name"
                ref={honeypotRef}
                style={{ display: 'none' }}
                name="full-on-pooh-bear"
              />
              <input
                className="formkit-input h-10 w-full grow rounded-b-none rounded-t border border-b-0 border-solid border-pink-600 bg-white px-[2ch] py-[1ch] font-normal text-gray-950"
                aria-label="First Name"
                name="fields[first_name]"
                required
                placeholder="First Name"
                type="text"
                ref={firstNameRef}
              />
              <input
                className="formkit-input h-10 w-full grow rounded-b-none border border-b-0 border-solid border-pink-600 bg-white px-[2ch] py-[1ch] font-normal text-gray-950"
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
                className="formkit-submit formkit-submit padding-[1ch 2ch] h-10 grow rounded-b rounded-t-none font-normal"
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
