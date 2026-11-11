import { useState } from 'react';

export type NewsletterModalTrigger = 'fab';

/** Open state for the newsletter modal, which only the floating button opens. */
export const useNewsletterModalTrigger = () => {
  const [openedBy, setOpenedBy] = useState<NewsletterModalTrigger | null>(null);

  const open = (trigger: NewsletterModalTrigger) => setOpenedBy(trigger);
  const dismiss = () => setOpenedBy(null);

  return { isOpen: openedBy !== null, openedBy, open, dismiss };
};
