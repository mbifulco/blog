import type { Tag } from 'resend';

export const EmailTags: Record<string, Tag> = {
  SubscriberNotification: {
    name: 'category',
    value: 'subscriber_notification',
  },
  BlockedSignupsDigest: {
    name: 'category',
    value: 'blocked_signups_digest',
  },
} as const;
