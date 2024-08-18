import type { Tag } from 'resend';

export const EmailTags: Record<string, Tag> = {
  SubscriberNotification: {
    name: 'category',
    value: 'subscriber_notification',
  },
} as const;
