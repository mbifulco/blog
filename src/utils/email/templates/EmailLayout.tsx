import * as React from 'react';
import {
  Body,
  Container,
  Head,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';

type EmailLayoutProps = {
  preview: string;
  children: React.ReactNode;
  /** Optional first name for greeting. Set to `false` to disable greeting entirely. */
  firstName?: string | false;
  includeUnsubscribeLink?: boolean;
};

export const EmailLayout = ({
  preview,
  children,
  firstName,
  includeUnsubscribeLink = false,
}: EmailLayoutProps) => {
  const showGreeting = firstName !== false;
  const greeting = `Hey ${typeof firstName === 'string' ? firstName : 'there'}`;

  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>

      <Tailwind>
        <Body className="mx-auto my-auto bg-[#fafafa] px-4 font-sans text-xl">
          <Container>
            {/* Logo Section */}
            <Section style={logo} align="center">
              <Row>
                <Img
                  src="https://res.cloudinary.com/mikebifulco-com/image/upload/v1723993230/email/logo-underline.png"
                  alt="Tiny Improvements"
                  height={62}
                  width={125}
                  style={{ display: 'block', margin: '0 auto' }}
                />
              </Row>
            </Section>

            {/* Main Content */}
            <Section style={content}>
              {showGreeting && <Text style={paragraph}>{greeting},</Text>}
              {children}
            </Section>

            {/* Footer Image */}
            <Section style={containerImageFooter} align="center">
              <Img
                className="mx-auto max-w-full"
                width={620}
                height={92}
                src="https://res.cloudinary.com/mikebifulco-com/image/upload/v1723993697/email/footerimg.png"
                alt="These lovely plant graphics are licensed from Jyothi on The Noun Project: https://thenounproject.com/creator/jyothi.shilpa077"
              />
            </Section>

            {/* Footer Text */}
            <Text
              style={{
                textAlign: 'center',
                fontSize: 12,
                color: 'rgb(0,0,0, 0.7)',
              }}
            >
              © 2024 | 💌 Tiny Improvements ·{' '}
              <Link href="https://mikebifulco.com" className="text-pink-600">
                mikebifulco.com
              </Link>{' '}
              {includeUnsubscribeLink && (
                <Text className="my-0">
                  Not getting what you need? No worries, you can
                  <Link
                    href={`{{{RESEND_UNSUBSCRIBE_URL}}}`}
                    className="text-pink-600"
                  >
                    {' '}
                    unsubscribe
                  </Link>{' '}
                  anytime.
                </Text>
              )}
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default EmailLayout;

// Shared styles
const logo = {
  padding: '30px 20px',
};

const content = {
  border: '1px solid rgb(0,0,0, 0.1)',
  borderRadius: '3px',
  overflow: 'hidden',
  maxWidth: '500px',
  backgroundColor: '#fff',
  paddingTop: '8px',
  paddingBottom: '8px',
  paddingLeft: '16px',
  paddingRight: '16px',
};

const containerImageFooter = {
  padding: '5px 0 0 0',
};

// Export common paragraph style for use in email components
export const paragraph = {
  fontSize: 20,
  lineHeight: '1.6',
  color: '#222',
};

// Export common button style for use in email components
export const button = {
  backgroundColor: '#D83D84',
  borderRadius: 3,
  color: '#FFF',
  fontWeight: 'bold',
  border: '1px solid rgb(0,0,0, 0.1)',
  cursor: 'pointer',
  padding: '12px 30px',
};

// Export common code styles for use in email components
export const codeInline = {
  fontSize: 16,
  backgroundColor: 'rgb(0,0,0, 0.05)',
  padding: '2px 6px',
  borderRadius: 3,
  fontFamily: 'monospace',
};

export const codeBlock = {
  fontSize: 14,
  fontFamily: 'monospace',
  overflowX: 'auto' as const,
  maxWidth: '100%',
};
