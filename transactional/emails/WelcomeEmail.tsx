import * as React from 'react';
import {
  Body,
  Button,
  Column,
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

interface WelcomeEmailProps {
  firstName?: string;
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : '';

export const WelcomeEmail = ({ firstName }: WelcomeEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>🧋 Let's build things that matter</Preview>

      <Tailwind>
        <Body className="mx-auto my-auto bg-[#fafafa] px-2 font-sans text-xl">
          <Container>
            <Section style={logo} align="center">
              <Row align="center">
                <Column align="center">
                  <Img
                    src={`https://res.cloudinary.com/mikebifulco-com/image/upload/v1723993230/email/logo-underline.png`}
                    alt="Tiny Improvements"
                    height={62}
                    width={125}
                  />
                </Column>
              </Row>
            </Section>

            <Section style={content}>
              <Row className="p-4">
                <Column>
                  <Text style={paragraph}>Hi {firstName ?? 'friend'},</Text>

                  <Text style={paragraph}>
                    Thanks for trusting me with a spot in your inbox—I'm
                    thrilled to have you here!
                  </Text>
                  <Text style={paragraph}>Here's what you can expect:</Text>

                  <ol style={{ paddingLeft: 20 }}>
                    <li style={paragraph}>
                      <b>One Tiny idea:</b> In each dispatch, I'll share a
                      simple, actionable idea to help you design and build
                      better products.
                    </li>
                    <li style={paragraph}>
                      <b>Straight Talk:</b>I keep things honest and practical,
                      based on my experience as a startup founder, and working
                      at companies like Google, Stripe, and Microsoft.
                    </li>
                  </ol>

                  <Text style={paragraph}>
                    To make sure you don't miss out, add{' '}
                    <Link
                      href="mailto:hello@mikebifulco.com"
                      className="text-pink-600"
                    >
                      hello@mikebifulco.com
                    </Link>{' '}
                    to your contacts. And if Tiny Improvements isn't your thing,
                    you can unsubscribe anytime — no hard feelings.
                  </Text>
                  <Text style={paragraph}>
                    Thanks again for joining Tiny Improvements. I can't wait to
                    see what you build!
                  </Text>

                  <Text style={paragraph}>
                    Cheers,
                    <br />
                    Mike
                  </Text>
                </Column>
              </Row>
              <Row>
                <Column
                  className="flex flex-col justify-center pb-8"
                  align="center"
                >
                  <Button style={button} className="mx-auto w-fit">
                    Read the latest dispatch
                  </Button>
                </Column>
              </Row>
            </Section>

            <Section style={containerImageFooter}>
              <Img
                style={image}
                width={620}
                height={92}
                src={`https://res.cloudinary.com/mikebifulco-com/image/upload/v1723993697/email/footerimg.png`}
              />
            </Section>

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
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default WelcomeEmail;

const paragraph = {
  fontSize: 16,
};

const logo = {
  padding: '30px 20px',
};

const button = {
  backgroundColor: '#D83D84',
  borderRadius: 3,
  color: '#FFF',
  fontWeight: 'bold',
  border: '1px solid rgb(0,0,0, 0.1)',
  cursor: 'pointer',
  padding: '12px 30px',
};

const content = {
  border: '1px solid rgb(0,0,0, 0.1)',
  borderRadius: '3px',
  overflow: 'hidden',
  maxWidth: '500px',
  backgroundColor: '#fff',
};

const image = {
  maxWidth: '100%',
};

const containerImageFooter = {
  padding: '5px 0 0 0',
};
