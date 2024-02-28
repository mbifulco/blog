import { Container } from '@chakra-ui/react';

import { Heading } from '@components/Heading';
import ResendNewsletterSignup from '@components/NewsletterSignup/ResendNewsletterSignup';

const ResendTestPage = () => {
  return (
    <>
      <Container>
        <main>
          <Heading as="h1">Resend Test Page</Heading>
        </main>
      </Container>
      <ResendNewsletterSignup />
    </>
  );
};

export default ResendTestPage;
