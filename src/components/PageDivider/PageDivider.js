import React from 'react';

import classes from './PageDivider.module.css';

const PageDivider = () => {
  return (
    <div className={classes.container}>
      <div className={classes.skewed} />
    </div>
  );
};

export default PageDivider;
