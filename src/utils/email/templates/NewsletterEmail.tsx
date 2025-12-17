import {
  Column,
  Img,
  Link,
  Markdown,
  Row,
  Text,
} from '@react-email/components';

import { EmailLayout } from './EmailLayout';

type NewsletterEmailProps = {
  content: string;
  excerpt: string;
  coverImage?: string;
};

/**
 * Newsletter email template for broadcasting newsletters via Resend.
 *
 * Takes markdown content and renders it using the EmailLayout component.
 * No greeting is shown (firstName={false}) as newsletters are sent to the full list.
 *
 * The content can include inline HTML for custom components like SponsoredSection.
 */
export const NewsletterEmail = ({
  content = 'lorem ipsum dolor sit amet this is just sample content for email preview',
  excerpt = 'Preview text for email clients',
  coverImage = 'https://picsum.photos/1200/630',
}: NewsletterEmailProps) => {
  return (
    <EmailLayout
      preview={excerpt}
      firstName={false}
      includeUnsubscribeLink={true}
    >
      {coverImage && (
        <Row>
          <Column>
            <Img
              src={coverImage}
              alt="Newsletter cover image"
              className="mt-2 w-full rounded"
              style={{
                maxWidth: '100%',
                height: 'auto',
              }}
            />
          </Column>
        </Row>
      )}
      <Row>
        <Column>
          <Markdown markdownContainerStyles={{ fontSize: '1.25rem', lineHeight: 1.4 }}>
            {content}
          </Markdown>
        </Column>
      </Row>
      <Row>
        <Column>
          <Text className="text-xl">Give &apos;em hell out there. ✌️</Text>
          <Text className="text-xl">- Mike</Text>
        </Column>
      </Row>
      <Row>
        <Column>
          <Text className="italic text-gray-500">
            Thanks for reading 💌 Tiny Improvements. If you found this helpful,
            I&apos;d love it if you{' '}
            <Link
              href="https://mikebifulco.com/newsletter"
              className="text-pink-600"
            >
              share it with a friend
            </Link>
            . It helps me out a great deal!
          </Text>
        </Column>
      </Row>
    </EmailLayout>
  );
};

export default NewsletterEmail;
