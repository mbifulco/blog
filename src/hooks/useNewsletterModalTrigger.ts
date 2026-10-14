import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

const MODAL_SHOWN_KEY = 'newsletter_modal_shown';
const MODAL_DISMISSED_AT_KEY = 'newsletter_modal_dismissed_at';
const DISMISSAL_TTL_MS = 30 * 24 * 60 * 60 * 1000;

export type NewsletterModalTrigger = 'scroll' | 'fab';

type UseNewsletterModalTriggerProps = {
  scrollDepth?: number; // percentage (0-100)
};

// Modal will not be shown on these paths
const DO_NOT_SHOW_ON_PATHS = ['/subscribe', '/newsletter'];

const wasDismissedRecently = () => {
  try {
    const dismissedAt = Number(localStorage.getItem(MODAL_DISMISSED_AT_KEY));
    return Date.now() - dismissedAt < DISMISSAL_TTL_MS;
  } catch {
    return false;
  }
};

/**
 * Opens the newsletter modal once per session when the reader scrolls past
 * `scrollDepth`, and stays quiet for 30 days after they dismiss it.
 *
 * @param scrollDepth - Scroll depth percentage (0-100) that opens the modal (default: 50)
 */
export const useNewsletterModalTrigger = ({
  scrollDepth = 50,
}: UseNewsletterModalTriggerProps = {}) => {
  const [openedBy, setOpenedBy] = useState<NewsletterModalTrigger | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (pathname && DO_NOT_SHOW_ON_PATHS.includes(pathname)) return;
    if (sessionStorage.getItem(MODAL_SHOWN_KEY) || wasDismissedRecently())
      return;

    const handleScroll = () => {
      const scrollableHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (scrollableHeight <= 0) return;
      const scrollPercent = (window.scrollY / scrollableHeight) * 100;

      if (scrollPercent > scrollDepth) {
        setOpenedBy('scroll');
        sessionStorage.setItem(MODAL_SHOWN_KEY, 'true');
        window.removeEventListener('scroll', handleScroll);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname, scrollDepth]);

  const open = (trigger: NewsletterModalTrigger) => setOpenedBy(trigger);

  const dismiss = () => {
    setOpenedBy(null);
    try {
      localStorage.setItem(MODAL_DISMISSED_AT_KEY, String(Date.now()));
    } catch {
      // Storage is blocked, so the modal may reappear next session.
    }
  };

  return { isOpen: openedBy !== null, openedBy, open, dismiss };
};
