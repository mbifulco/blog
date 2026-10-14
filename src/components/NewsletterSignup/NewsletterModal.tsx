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
  const { isOpen, openedBy, open, dismiss } = useNewsletterModalTrigger();

  useEffect(() => {
    if (openedBy) {
      if (process.env.NODE_ENV === 'development')
        console.log('newsletter_modal_viewed', openedBy);
      posthog?.capture('newsletter_modal_viewed', { trigger: openedBy });
    }
  }, [openedBy, posthog]);

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) return;
    posthog?.capture('newsletter_modal_dismissed', { trigger: openedBy });
    dismiss();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="border-riso-blue bg-stock w-[calc(100%-2rem)] rounded-none border-2 max-sm:top-6 max-sm:translate-y-0 sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-ink text-balance text-center font-futura text-2xl font-bold">
              Join{' '}
              <span className="text-riso-pink">
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
          <p className="text-ink-muted text-center text-xs">
            No spam. Unsubscribe anytime.
          </p>
        </DialogContent>
      </Dialog>

      {!isOpen && (
        <button
          onClick={() => {
            open('fab');
            posthog?.capture('newsletter_fab_clicked');
          }}
          className="border-riso-pink bg-stock fixed bottom-4 right-4 z-50 flex h-12 w-12 items-center justify-center rounded-full border-2 shadow-[0_6px_16px_-6px_rgb(0_0_0/0.35)] transition-transform hover:scale-110 sm:bottom-6 sm:right-6 sm:h-14 sm:w-14"
          aria-label="Subscribe to newsletter"
        >
          <span className="animate-wiggle-interval text-xl sm:text-2xl">
            💌
          </span>
        </button>
      )}
    </>
  );
};

export default NewsletterModal;
