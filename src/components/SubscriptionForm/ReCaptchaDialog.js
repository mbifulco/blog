import { useRef } from 'react';

import {
  Button,
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
} from '@chakra-ui/react';

const ReCaptchaDialog = ({ url }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();

  return (
    <AlertDialog
      isOpen={!!url}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
      isCentered
    >
      <AlertDialogOverlay>
        <AlertDialogContent height="275px" width="500px" maxWidth="100%">
          <AlertDialogCloseButton zIndex={100} />

          <AlertDialogBody>
            <iframe
              style={{
                position: 'absolute',
                top: '0px',
                left: '0px',
                overflowX: 'hidden',
                clipPath: `inset(10px 30px 10px 10px)`,
              }}
              height="275"
              width="500"
              id="convertkit-recaptcha"
              title="Please confirm you're not a robot"
              src={url}
            />
          </AlertDialogBody>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export default ReCaptchaDialog;
