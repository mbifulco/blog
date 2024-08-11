import { useRef } from 'react';
import Link from 'next/link';
import posthog from 'posthog-js';

import Button from '@components/Button';
import useNewsletterStats from '@utils/hooks/useNewsletterStats';
import { trpc } from '@utils/trpc';

type SubscriptionFormProps = {
  tags?: string[];
  source?: string;
};

const SubscriptionForm: React.FC<SubscriptionFormProps> = ({
  tags: _,
  source,
}) => {
  const addSubscriberMutation = trpc.mailingList.subscribe.useMutation();
  const { refreshStats } = useNewsletterStats();

  const formRef = useRef<HTMLFormElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const firstNameRef = useRef<HTMLInputElement>(null);

  const handleSubmission = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const email = emailRef.current?.value;
    const firstName = firstNameRef.current?.value;

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

    if (addSubscriberMutation.isSuccess) {
      refreshStats();
      posthog.capture('newsletter/subscribed', {
        source,
        email,
        firstName,
      });
    } else if (addSubscriberMutation.error) {
      posthog.capture('newsletter/subscribe_error', {
        source,
        email,
        firstName,
        error: addSubscriberMutation.error,
      });
    }
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

  if (addSubscriberMutation.isSuccess) {
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
              className="seva-fields formkit-fields grid w-full items-center rounded md:grid-cols-3"
              data-element="fields"
              data-stacked="false"
            >
              <input
                className="formkit-input h-10 w-full grow rounded-b-none rounded-t border border-b-0 border-solid border-pink-600 bg-white px-[2ch] py-[1ch] font-normal text-gray-950 md:rounded-l md:rounded-r-none md:border-b md:border-r-0"
                aria-label="First Name"
                name="fields[first_name]"
                required
                placeholder="First Name"
                type="text"
                ref={firstNameRef}
              />
              <input
                className="formkit-input h-10 w-full grow rounded-b-none border border-b-0 border-solid border-pink-600 bg-white px-[2ch] py-[1ch] font-normal text-gray-950 md:border-b"
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
                className="formkit-submit formkit-submit padding-[1ch 2ch] h-10 grow rounded-b rounded-t-none font-normal md:rounded-l-none md:rounded-r"
              >
                <div className="formkit-spinner">
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
                <span>💌 Subscribe</span>
              </Button>
            </div>
          </div>
        </fieldset>
      </form>
    </div>
  );
};

export default SubscriptionForm;
