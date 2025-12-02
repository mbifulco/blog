import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

const MODAL_SHOWN_KEY = 'newsletter_modal_shown';
const MODAL_DISMISSED_KEY = 'newsletter_modal_dismissed';

type UseNewsletterModalTriggerProps = {
  timeOnPage?: number; // in milliseconds
  scrollDepth?: number; // percentage (0-100)
};

// Modal will not be shown on these paths
const DO_NOT_SHOW_ON_PATHS = ['/subscribe', '/newsletter'];

/**
 * Hook to manage newsletter modal trigger logic based on time on page and scroll depth.
 * The modal will be shown once per session when either trigger condition is met.
 *
 * @param timeOnPage - Time in milliseconds before showing the modal (default: 30000ms30s)
 * @param scrollDepth - Scroll depth percentage (0-100) to trigger the modal (default: 50)
 * @returns { isOpen: boolean, setIsOpen: (isOpen: boolean) => void, dismiss: () => void }
 */
export const useNewsletterModalTrigger = ({
  timeOnPage = 30000,
  scrollDepth = 50,
}: UseNewsletterModalTriggerProps = {}) => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (pathname && DO_NOT_SHOW_ON_PATHS.includes(pathname)) return;

    // Check if already shown or dismissed
    const hasBeenShown = sessionStorage.getItem(MODAL_SHOWN_KEY);
    const hasBeenDismissed = sessionStorage.getItem(MODAL_DISMISSED_KEY);

    if (hasBeenShown || hasBeenDismissed) return;

    let timeTimeout: NodeJS.Timeout;

    // Scroll depth trigger
    const handleScroll = () => {
      // Check if already shown (in case time trigger fired first)
      const hasBeenShown = sessionStorage.getItem(MODAL_SHOWN_KEY);
      if (hasBeenShown) {
        window.removeEventListener('scroll', handleScroll);
        return;
      }

      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight;
      const winHeight = window.innerHeight;
      const scrollableHeight = docHeight - winHeight;
      if (scrollableHeight <= 0) return; // Page is not scrollable
      const scrollPercent = (scrollTop / scrollableHeight) * 100;

      if (scrollPercent > scrollDepth) {
        setIsOpen(true);
        sessionStorage.setItem(MODAL_SHOWN_KEY, 'true');
        window.removeEventListener('scroll', handleScroll);
        if (timeTimeout) clearTimeout(timeTimeout);
      }
    };

    // Time on page trigger
    if (timeOnPage > 0) {
      timeTimeout = setTimeout(() => {
        setIsOpen(true);
        sessionStorage.setItem(MODAL_SHOWN_KEY, 'true');
        // Remove scroll listener since we're showing the modal now
        window.removeEventListener('scroll', handleScroll);
      }, timeOnPage);
    }

    if (scrollDepth > 0) {
      window.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (timeTimeout) clearTimeout(timeTimeout);
      if (scrollDepth > 0) {
        window.removeEventListener('scroll', handleScroll);
      }
    };
  }, [pathname, timeOnPage, scrollDepth]);

  const dismiss = () => {
    setIsOpen(false);
    sessionStorage.setItem(MODAL_DISMISSED_KEY, 'true');
  };

  return { isOpen, setIsOpen, dismiss };
};
