import React, { useEffect } from 'react';
import { useNewsletterModalTrigger } from '@hooks/useNewsletterModalTrigger';
import { usePostHog } from 'posthog-js/react';

import { SubscriptionForm } from '@components/SubscriptionForm';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@components/ui/dialog';
import SubscriberCount from './SubscriberCount';

const NewsletterModal = () => {
  const posthog = usePostHog();
  const { isOpen, setIsOpen, dismiss } = useNewsletterModalTrigger();

  useEffect(() => {
    if (isOpen) {
      if (process.env.NODE_ENV === 'development')
        console.log('newsletter_modal_viewed');
      posthog?.capture('newsletter_modal_viewed');
    }
  }, [isOpen, posthog]);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      dismiss();
      posthog?.capture('newsletter_modal_dismissed');
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-balance text-center text-2xl font-bold">
              Join{' '}
              <span className="text-pink-600">
                <SubscriberCount />
              </span>{' '}
              founders & engineers building better products
            </DialogTitle>
            <DialogDescription className="pt-2 text-center text-base">
              Get tactical advice, technical deep-dives, and startup lessons
              from an ex-Google, Stripe, & Microsoft engineer turned YC founder.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <SubscriptionForm
              source="newsletter-modal"
              buttonText="Join the Inner Circle"
            />
          </div>
          <p className="text-center text-xs text-gray-500">
            No spam. Unsubscribe anytime.
          </p>
        </DialogContent>
      </Dialog>

      {!isOpen && (
        <button
          onClick={() => {
            setIsOpen(true);
            posthog?.capture('newsletter_fab_clicked');
          }}
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full border-2 border-pink-500 bg-white shadow-xl transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-pink-200 focus:ring-offset-2"
          aria-label="Subscribe to newsletter"
        >
          <span className="animate-wiggle-interval text-2xl">💌</span>
        </button>
      )}
    </>
  );
};

export default NewsletterModal;
