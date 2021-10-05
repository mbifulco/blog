/* global fathom */

import React, { createContext, useContext } from 'react';
import PropTypes from 'prop-types';

const AnalyticsContext = createContext({});

export const AnalyticsProvider = ({ children }) => {
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

export const useAnalytics = () => useContext(AnalyticsContext);
