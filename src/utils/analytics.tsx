/* global fathom */

import React, { createContext, useContext } from 'react';

const AnalyticsContext = createContext({});

type AnalyticsProviderProps = {
  children: React.ReactNode;
};

export const AnalyticsProvider: React.FC<AnalyticsProviderProps> = ({
  children,
}) => {
  const logClicks = (goalId: string, valueInCents = 0) => {
    if (fathom?.trackGoal) {
      fathom.trackGoal(goalId, valueInCents);
    }
  };

  return (
    <AnalyticsContext.Provider value={logClicks}>
      {children}
    </AnalyticsContext.Provider>
  );
};

export const useAnalytics = () => useContext(AnalyticsContext);
