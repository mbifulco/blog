import * as React from 'react';
import { Button, Column, Link, Row, Text } from '@react-email/components';

import { button, EmailLayout, paragraph } from './EmailLayout';

type WelcomeEmailProps = {
  firstName?: string;
};

export const WelcomeEmail = ({ firstName }: WelcomeEmailProps) => {
  return (
    <EmailLayout preview="🧋 Let's build things that matter" firstName={firstName}>
      <Row>
        <Column>
          <Text style={paragraph}>
            Thanks for trusting me with a spot in your inbox-I&apos;m thrilled
            to have you here!
          </Text>
          <Text style={paragraph}>Here&apos;s what you can expect:</Text>

          <ol style={{ paddingLeft: 20 }}>
            <li style={paragraph}>
              <b>One Tiny idea:</b> In each dispatch, I&apos;ll share a simple,
              actionable idea to help you design and build better products.
            </li>
            <li style={paragraph}>
              <b>Straight Talk:</b> I keep things honest and practical, based on
              my experience as founder of a Y Combinator Startup, and working at
              companies like Google, Stripe, and Microsoft.
            </li>
          </ol>

          <Text style={paragraph}>
            To make sure you don&apos;t miss out, add{' '}
            <Link
              href="mailto:hello@mikebifulco.com"
              className="text-pink-600"
            >
              hello@mikebifulco.com
            </Link>{' '}
            to your contacts. And if Tiny Improvements isn&apos;t your thing,
            you can unsubscribe anytime - no hard feelings.
          </Text>

          <Text style={paragraph}>
            <b>Become a paid subscriber</b> <br />
            Consider becoming a{' '}
            <Link
              href="https://patreon.com/tinyimprovements?utm_medium=email&utm_source=newsletter&utm_campaign=welcome_email&utm_content=patreon_support"
              className="text-pink-600"
            >
              paid subscriber on Patreon
            </Link>
            . Your support helps me continue sharing my experience and knowledge
            with aspiring founders and indiehackers like you!
          </Text>

          <Text style={paragraph}>
            Thanks again for joining Tiny Improvements. I can&apos;t wait to see
            what you build!
          </Text>

          <Text style={paragraph}>
            Cheers,
            <br />
            Mike
          </Text>
        </Column>
      </Row>
      <Row>
        <Column className="pb-8" align="center">
          <Button
            style={button}
            className="mx-auto w-fit"
            href="https://mikebifulco.com/newsletter"
          >
            Read the latest dispatch
          </Button>
        </Column>
      </Row>
    </EmailLayout>
  );
};

export default WelcomeEmail;
