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
      <Head>
        <style>{`
          h1, h2, h3, h4, h5, h6 {
            font-weight: 700;
            color: #D83D84;
            margin-top: 24px;
            margin-bottom: 16px;
            line-height: 1.3;
          }
          h1 { font-size: 32px; }
          h2 { font-size: 28px; }
          h3 { font-size: 24px; }
          h4 { font-size: 20px; }
          h5 { font-size: 18px; }
          h6 { font-size: 16px; }
        `}</style>
      </Head>
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
            <Section
              style={{
                maxWidth: '500px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
              }}
              className="mt-2 text-gray-500"
            >
              <Text
                style={{
                  fontSize: 12,
                }}
                className="my-0"
              >
                © {new Date().getFullYear()} &bull; 💌 Tiny Improvements &bull;{' '}
                <Link
                  href="https://mikebifulco.com/newsletter"
                  className="text-pink-600"
                >
                  mikebifulco.com
                </Link>{' '}
              </Text>
              {includeUnsubscribeLink && (
                <Text className="my-0 text-xs text-gray-500">
                  Not getting what you need? No worries, you can{' '}
                  <Link
                    href="{{{RESEND_UNSUBSCRIBE_LINK}}}"
                    className="text-pink-600"
                  >
                    unsubscribe
                  </Link>{' '}
                  anytime.
                </Text>
              )}
            </Section>
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
