import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';;

import * as style from '../styles/navigation.module.scss';

const Navigation = ({ nextPath, previousPath, nextLabel, previousLabel }) =>
  previousPath || nextPath ? (
    <div className={style.navigation}>
      {previousPath && (
        <span className={style.button}>
          <Link href={previousPath}>
            <>
              <span className={style.iconPrev}>←</span>
              <span className={style.buttonText}>{previousLabel}</span>
            </>
          </Link>
        </span>
      )}
      {nextPath && (
        <span className={style.button}>
          <Link href={nextPath}>
            <>
              <span className={style.buttonText}>{nextLabel}</span>
              <span className={style.iconNext}>→</span>
            </>
          </Link>
        </span>
      )}
    </div>
  ) : null;

Navigation.propTypes = {
  nextPath: PropTypes.string,
  previousPath: PropTypes.string,
  nextLabel: PropTypes.string,
  previousLabel: PropTypes.string,
};

export default Navigation;
