// prismjs color theme
require('./src/styles/prism.css');

const React = require('react');
const { AnalyticsProvider } = require('./src/utils/analytics');

exports.wrapPageElement = ({ element }) => {
  return <AnalyticsProvider>{element}</AnalyticsProvider>;
};
