const LogRocket = require('logrocket');

// prismjs color theme
require('./src/styles/prism.css');

// start up logrocket
LogRocket.init('mike-bifulco/mikebifulco');

const React = require('react');
const { AnalyticsProvider } = require('./src/utils/analytics');

exports.wrapPageElement = ({ element, props }) => {
  return <AnalyticsProvider>{element}</AnalyticsProvider>;
};
