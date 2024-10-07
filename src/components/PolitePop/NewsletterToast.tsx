import { useEffect, useState } from 'react';
import posthog from 'posthog-js';

import SubscriptionForm from '@/components/SubscriptionForm/SubscriptionForm';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import useNewsletterStats from '@/hooks/useNewsletterStats';

export const NewsletterToast = () => {
  const { subscriberCount } = useNewsletterStats();
  const [showToast, setShowToast] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    // Show toast after 15 seconds if not already displayed
    timeoutId = setTimeout(() => {
      if (!showToast) {
        setShowToast(true);
      }
    }, 15000);

    // Existing mouse leave detection
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        setShowToast(true);
        clearTimeout(timeoutId); // Clear timeout if toast is shown due to mouse leave
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);

    // Add keyboard shortcut for development environment
    if (process.env.NODE_ENV === 'development') {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'j' && e.metaKey) {
          setShowToast(true);
        }
      };

      document.addEventListener('keydown', handleKeyDown);

      return () => {
        clearTimeout(timeoutId);
        document.removeEventListener('mouseleave', handleMouseLeave);
        document.removeEventListener('keydown', handleKeyDown);
      };
    }

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [showToast]);

  useEffect(() => {
    if (showToast) {
      posthog.capture('newsletter-toast/show');
      toast({
        title: '💌 Tiny Improvements, Big Impact',
        description: (
          <span>
            Get short, digestable tips to help you build and grow your product
            directly in your inbox. Join {subscriberCount} founders and builders
            getting smarter every week.
          </span>
        ),
        action: (
          <Button
            onClick={() => {
              posthog.capture('newsletter-toast/subscribe-clicked');
              setDialogOpen(true);
            }}
            className="bg-pink-600 hover:bg-pink-700"
          >
            Let's go!
          </Button>
        ),

        duration: Infinity,
      });
    }
  }, [showToast, toast]);

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>💌 Tiny Improvements for Product Builders</DialogTitle>
          <DialogDescription>
            Join {subscriberCount} founders and product builders getting smarter
            every week. Get actionable tips on design, dev, and startup growth.
          </DialogDescription>
        </DialogHeader>
        <SubscriptionForm source="newsletter-toast" />
      </DialogContent>
    </Dialog>
  );
};

export default NewsletterToast;
