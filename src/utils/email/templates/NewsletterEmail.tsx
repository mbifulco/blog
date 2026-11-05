import { Column, Img, Link, Markdown, Row, Text } from 'react-email';

import { EmailLayout } from './EmailLayout';

type NewsletterEmailProps = {
  title: string;
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
  title = 'Sample newsletter title',
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
              alt={title}
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
          <Markdown
            markdownContainerStyles={{
              fontSize: 20,
              lineHeight: 1.6,
              // Lets long URLs wrap instead of widening the email on phones
              wordBreak: 'break-word',
              overflowWrap: 'anywhere',
            }}
            markdownCustomStyles={{
              p: { fontSize: '20px', lineHeight: '1.6', color: '#222' },
              ol: { margin: '0 0 20px 0', paddingLeft: '1.25em' },
              ul: { margin: '0 0 20px 0', paddingLeft: '1.25em' },
              li: { marginBottom: '8px' },
              // A <pre> doesn't wrap by default, so one long line widens the whole
              // email and phone clients shrink every line of text to fit it
              codeBlock: {
                display: 'block',
                margin: '0 0 20px 0',
                padding: '12px',
                background: '#f8f8f8',
                color: '#212529',
                fontFamily: 'SFMono-Regular,Menlo,Monaco,Consolas,monospace',
                fontSize: '15px',
                lineHeight: '1.5',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                overflowWrap: 'anywhere',
              },
              // Inline, because some clients strip the <style> block's img rule
              image: { maxWidth: '100%', height: 'auto' },
              blockQuote: {
                margin: '40px 0',
                padding: 0,
                background: 'none',
                borderLeft: 'none',
              },
            }}
          >
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
            Thanks for reading 💌 Tiny Improvements. Got a thought, a question,
            or a story of your own? Hit reply. It comes straight to me.
          </Text>
          <Text className="italic text-gray-500">
            If this was useful, forward it to a friend, or send them to{' '}
            <Link
              href="https://mikebifulco.com/subscribe"
              className="text-pink-600"
            >
              mikebifulco.com/subscribe
            </Link>
            . It helps me out a great deal!
          </Text>
        </Column>
      </Row>
    </EmailLayout>
  );
};

export default NewsletterEmail;
