import React from 'react';
import PropTypes from 'prop-types';

import { Flex, Text } from '@chakra-ui/react'

import * as style from '../styles/icon.module.scss';

const Icon = (props) => {
  const { d, size = '1em', label, style: styles } = props;

  return (
    <Flex
      display="inline-flex"
      alignItems="center"
      justifyContent="center"
      style={styles}
      role="figure"
    >
      <svg
        version="1.1"
        width={size}
        height={size}
        viewBox="0 0 48 48"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d={d} className={style.icon} fill="currentColor" />
      </svg>
      {label && (
        <Text
          position="relative"
          display="inline-block"
          margin-left="4px"
          line-height={1}
        >
          {label}
        </Text>
      )}
    </Flex>
  );
};

Icon.propTypes = {
  d: PropTypes.string,
  size: PropTypes.number,
  label: PropTypes.string,
  style: PropTypes.object,
};

export default Icon;
