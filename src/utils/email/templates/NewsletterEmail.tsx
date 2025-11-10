import * as React from 'react';
import { Column, Markdown, Row } from '@react-email/components';

import { EmailLayout } from './EmailLayout';

type NewsletterEmailProps = {
  content: string;
  excerpt: string;
};

/**
 * Newsletter email template for broadcasting newsletters via Resend.
 *
 * Takes markdown content and renders it using the EmailLayout component.
 * No greeting is shown (firstName={false}) as newsletters are sent to the full list.
 *
 * Usage:
 * ```tsx
 * import { NewsletterEmail } from './templates/NewsletterEmail';
 * import { render } from '@react-email/render';
 *
 * const html = render(
 *   <NewsletterEmail
 *     content={markdownContent}
 *     excerpt="Preview text for email clients"
 *   />
 * );
 * ```
 */
export const NewsletterEmail = ({ content, excerpt }: NewsletterEmailProps) => {
  return (
    <EmailLayout preview={excerpt} firstName={false}>
      <Row>
        <Column>
          <Markdown>{content}</Markdown>
        </Column>
      </Row>
    </EmailLayout>
  );
};

export default NewsletterEmail;
