import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { Box, Button } from '@chakra-ui/react';

export const CenteredTextDemo = ({ children }) => {
  const [isCentered, setIsCentered] = useState(true);

  const ToggleButton = (
    <Button
      colorScheme="red"
      onClick={() => {
        setIsCentered(!isCentered);
      }}
    >
      Toggle the fix
      {/* {isCentered ? (
        <span>My eyes! Un-center this mess</span>
      ) : (
        <span>Wait, show me again</span>
      )} */}
    </Button>
  );

  return (
    <>
      {ToggleButton}
      <Box
        marginTop="1rem"
        marginBottom="1rem"
        style={{ textAlign: isCentered ? 'center' : 'inherit' }}
      >
        {children}
      </Box>
      {ToggleButton}
    </>
  );
};

CenteredTextDemo.propTypes = {
  children: PropTypes.node,
}

export default CenteredTextDemo;
