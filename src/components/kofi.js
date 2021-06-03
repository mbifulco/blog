import React from 'react';

import * as classes from '../styles/kofi.module.scss';

const Kofi = () => (
  <>
    <span className={classes.helpful}>Did you find this post helpful?</span>
    <a
      href="https://ko-fi.com/N4N8N10N"
      target="_blank"
      rel="noopener noreferrer"
    >
      <img
        style={{ border: '0px', height: '36px' }}
        src="https://az743702.vo.msecnd.net/cdn/kofi1.png?v=0"
        alt="Buy Me a Coffee at ko-fi.com"
        height="36"
        border="0"
      />
    </a>
  </>
);

export default Kofi;
