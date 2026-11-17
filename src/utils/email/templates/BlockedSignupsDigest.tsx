import type { BlockedSignup } from '@server/blockedSignups';
import type { SubscriptionStatus } from '../../resend';
import * as React from 'react';
import { Section, Text } from 'react-email';

import { EmailLayout, paragraph } from './EmailLayout';

export type DigestEntry = BlockedSignup & { status: SubscriptionStatus };

type BlockedSignupsDigestProps = {
  /** Eastern date, YYYY-MM-DD. */
  date: string;
  entries: DigestEntry[];
  capReached: boolean;
  maxPerDay: number;
};

const statusLabel: Record<SubscriptionStatus, string> = {
  subscribed: 'already subscribed',
  not_subscribed: 'not subscribed',
  unknown: 'unknown',
};

const timeFormat = new Intl.DateTimeFormat('en-US', {
  timeZone: 'America/New_York',
  hour: 'numeric',
  minute: '2-digit',
});

export const BlockedSignupsDigest = ({
  date,
  entries,
  capReached,
  maxPerDay,
}: BlockedSignupsDigestProps) => (
  <EmailLayout
    preview={`${entries.length} ${entries.length === 1 ? 'signup' : 'signups'} blocked by Turnstile on ${date}`}
    firstName={false}
  >
    <Text style={paragraph}>
      {entries.length} {entries.length === 1 ? 'person' : 'people'} submitted
      the signup form on {date} but failed Turnstile.
    </Text>
    <Text style={paragraph}>
      These signups did not pass the spam check, and some may be bots using real
      people&apos;s addresses. Check each one before adding it to the list, and
      never add them in bulk.
    </Text>
    {capReached && (
      <Text style={paragraph}>
        {`The daily cap of ${maxPerDay} was reached, so some reports may have been dropped.`}
      </Text>
    )}
    <Section>
      <table
        style={{ borderCollapse: 'collapse', width: '100%', fontSize: 14 }}
      >
        <thead>
          <tr>
            {[
              'Email',
              'Name',
              'Source',
              'Page',
              'Reason',
              'Time (ET)',
              'Status',
            ].map((heading) => (
              <th key={heading} style={cell}>
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr key={entry.email}>
              <td style={cell}>{entry.email}</td>
              <td style={cell}>{entry.firstName ?? ''}</td>
              <td style={cell}>{entry.source ?? ''}</td>
              <td style={cell}>{entry.path}</td>
              <td style={cell}>{entry.reason}</td>
              <td style={cell}>{timeFormat.format(new Date(entry.at))}</td>
              <td style={cell}>{statusLabel[entry.status]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Section>
  </EmailLayout>
);

export default BlockedSignupsDigest;

const cell = {
  border: '1px solid #ddd',
  padding: '4px 8px',
  textAlign: 'left' as const,
};
