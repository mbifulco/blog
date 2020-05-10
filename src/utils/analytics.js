/* global fathom */

import React, { createContext, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';

const AnalyticsContext = createContext({});

export const AnalyticsProvider = ({ children }) => {
  useEffect(() => {
    if (typeof fathom === 'undefined') {
      fathom = (x, y, z) => {
        // eslint-disable-next-line no-console
        console.log(`I'm a fake Fathom`, x, y, z);
      };
    }
  }, []);

  const logClicks = (goalId, valueInCents = 0) => {
    if (fathom && fathom.trackGoal) {
      fathom.trackGoal(goalId, valueInCents);
    }
  };

  return (
    <AnalyticsContext.Provider value={logClicks}>
      {children}
    </AnalyticsContext.Provider>
  );
};

AnalyticsProvider.propTypes = {
  children: PropTypes.node,
};

export const useAnalytics = () => {
  return useContext(AnalyticsContext);
};
