// Your code here

import { useState } from 'react';
import Script from 'next/script';

import GmailIcon from './GmailIcon';

import {
  Button,
  Icon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Text,
  useDisclosure,
  Container,
} from '@chakra-ui/react';

type ConfirmButtonProps = {
  email?: string;
  onClick?: () => void;
};

const ConfirmButton: React.FC<ConfirmButtonProps> = ({ email, onClick }) => {
  if (!email) return null;

  if (email.endsWith('@gmail.com')) {
    return (
      <Button
        leftIcon={<Icon as={GmailIcon} />}
        as="a"
        href={`https://mail.google.com/mail/#search/from%3A(hello%40mikebifulco.com)+in%3Aanywhere+newer_than%3A1h`}
        target="_blank"
        onClick={onClick}
      >
        Open Gmail
      </Button>
    );
  }
  return null;
};

type SubscribeEvent = {
  email?: string;
  firstName?: string;
};

const PolitePopEmbed = ({ debug = false }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [subscribeEvent, setSubscribeEvent] = useState<SubscribeEvent | null>(
    null
  );
  return (
    <>
      <Script
        src="https://cdn.politepop.com/polite-pop-v1.4.17/polite-pop.min.js"
        strategy="lazyOnload"
        onLoad={() => {
          PolitePop({
            styles: {
              popRoundedCorners: `8px`,
              popYesButtonTextColor: `#ffffff`,
              popYesButtonHoverTextColor: `#ffffff`,
              popYesButtonBackgroundColor: `#fe5186`,
              popYesButtonHoverBackgroundColor: `#fe4156`,
              modalBackgroundColor: `#222222`,
              modalBorder: `5px solid #ef0247`,
            },
            newEmailSignupSuccessMessage: '🎉 Thank you!',
            politePopHtml: `<p>Hey there - I put out an occasional newsletter with product and software development tips. Interested in subscribing?</p>`,
            politePopYesText: `Sounds great!`,
            exitIntentPopHtml: `<p>Interested in occasional updates on my writing and other work?</p>`,
            modalHtml: `<h2>Product strategies for Indie Hackers, react devs, and creators</h2><p>I write about building products, finding an audience, and useful tools for getting your work done. Typically 1-2 emails a month, straight from my brain to your inbox.&nbsp;😘</p><p>Unsubscribe any time.</p>`,
            character: `none`,
            signupFormAction: `https://app.convertkit.com/forms/1368838/subscriptions`,
            debug: debug,
          });

          PolitePop.onNewEmailSignup((e: SubscribeEvent) => {
            setSubscribeEvent(e);
            onOpen();
          });
        }}
      />
      <Modal
        onClose={onClose}
        size={'full'}
        isOpen={isOpen && !!subscribeEvent?.email}
      >
        <ModalOverlay />
        <ModalContent>
          <Container margin="auto">
            <ModalHeader fontSize={['2xl', '4xl', '5xl']}>
              Almost done
              {subscribeEvent?.firstName
                ? `, ${subscribeEvent.firstName}`
                : null}
              !
              <br />
              Check your inbox.
            </ModalHeader>
            <ModalCloseButton color={'pink.200'} />
            <ModalBody>
              <Text color={'blackAlpha.600'}>
                Confirm your address by clicking the link I sent to
              </Text>
              <Text>{subscribeEvent?.email}</Text>
            </ModalBody>
            <ModalFooter>
              <ConfirmButton onClick={onClose} email={subscribeEvent?.email} />
            </ModalFooter>
          </Container>
        </ModalContent>
      </Modal>
    </>
  );
};

export default PolitePopEmbed;
