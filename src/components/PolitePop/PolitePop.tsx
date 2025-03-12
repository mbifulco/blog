'use client';

import { Fragment, useState } from 'react';
import Script from 'next/script';
import { Dialog, Transition } from '@headlessui/react';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

import GmailIcon from '../icons/GmailIcon';

type ConfirmButtonProps = {
  email?: string;
  onClick?: () => void;
};

const emailIsGmail = (email?: string) => {
  if (!email) return false;
  return email?.endsWith('@gmail.com');
};

const ConfirmButton: React.FC<ConfirmButtonProps> = ({ email, onClick }) => {
  if (!email) return null;

  if (emailIsGmail(email)) {
    return (
      <a
        href={`https://mail.google.com/mail/#search/from%3A(${email})+in%3Aanywhere+newer_than%3A1h`}
        type="button"
        className="flex w-full justify-center gap-2 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        onClick={onClick}
      >
        <GmailIcon />
        Open Gmail
      </a>
    );
  }
  return null;
};

type SubscribeEvent = {
  email?: string;
  firstName?: string;
};

const PolitePopEmbed = ({ debug = false }) => {
  const [open, setOpen] = useState(false);

  const onOpen = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const [subscribeEvent, setSubscribeEvent] = useState<SubscribeEvent | null>(
    null
  );
  return (
    <>
      <Script
        src="https://cdn.politepop.com/polite-pop-v1.4.17/polite-pop.min.js"
        strategy="lazyOnload"
        onLoad={() => {
          PolitePop({
            styles: {
              popRoundedCorners: `8px`,
              popYesButtonTextColor: `#ffffff`,
              popYesButtonHoverTextColor: `#ffffff`,
              popYesButtonBackgroundColor: `#fe5186`,
              popYesButtonHoverBackgroundColor: `#fe4156`,
              modalBackgroundColor: `#222222`,
              modalBorder: `5px solid #ef0247`,
            },
            newEmailSignupSuccessMessage: '🎉 Thank you!',
            politePopHtml: `<p>💌 Tiny Improvements is my weekly newsletter for product builders. It's a single, tiny idea to help you build better products.</p><p>Interested in subscribing?</p>`,
            politePopYesText: `Sounds great!`,
            exitIntentPopHtml: `<p>💌 Tiny Improvements is my weekly newsletter for product builders. It's a single, tiny idea to help you build better products.</p><p>Interested in subscribing?</p>`,
            modalHtml: `<h2>Product strategies for Indie Hackers, react devs, and creators</h2><p>I write about building products, finding an audience, and useful tools for getting your work done. Typically 1-2 emails a month, straight from my brain to your inbox.&nbsp;😘</p><p>Unsubscribe any time.</p>`,
            character: `none`,
            signupFormAction: `https://app.convertkit.com/forms/1368838/subscriptions`,
            debug: debug,
          });

          PolitePop.onNewEmailSignup((e: SubscribeEvent) => {
            setSubscribeEvent(e);
            onOpen();
          });
        }}
      />

      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                  <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                    <button
                      type="button"
                      className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      onClick={onClose}
                    >
                      <span className="sr-only">Close</span>
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>
                  <div>
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                      {emailIsGmail(subscribeEvent?.email) ? (
                        <GmailIcon />
                      ) : (
                        <CheckIcon
                          className="h-6 w-6 font-bold text-green-600"
                          aria-hidden="true"
                        />
                      )}
                    </div>
                    <div className="mt-3 sm:mt-5">
                      <Dialog.Title
                        as="h3"
                        className="text-base font-semibold leading-6 text-gray-900"
                      >
                        Almost done
                        {subscribeEvent?.firstName
                          ? `, ${subscribeEvent.firstName}`
                          : null}
                        !
                      </Dialog.Title>
                      <div className="mt-2 flex flex-col gap-2">
                        <p className="text-gray-800">
                          Confirm your address by clicking the link I sent to
                          <span className="font-bold">
                            {' '}
                            {subscribeEvent?.email
                              ? subscribeEvent?.email
                              : 'your inbox'}
                          </span>
                          .
                        </p>
                        <p className="text-gray-800">
                          Thanks so much for subscribing. You&apos;re on your
                          way to building better products.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-6">
                    <ConfirmButton
                      onClick={onClose}
                      email={subscribeEvent?.email}
                    />
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
};

export default PolitePopEmbed;
