import React from 'react';
import PropTypes from 'prop-types';
import Image from 'next/image';

const Headshot = ({ className }) => (
  <Image
    src="/images/mike-headshot-square.png"
    height={50}
    width={50}
    alt="Mike Bifulco headshot"
    // style={{ borderRadius: '12px' }}
    className={`headshot ${className}`}
  />
);

Headshot.propTypes = {
  className: PropTypes.string,
};

export default Headshot;
