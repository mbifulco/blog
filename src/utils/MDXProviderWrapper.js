/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { MDXProvider } from '@mdx-js/react';

import { Box, Heading, useTheme } from '@chakra-ui/core';
import Highlight, { defaultProps } from 'prism-react-renderer';
import prismTheme from 'prism-react-renderer/themes/nightOwl';

const H1 = (props) => <Heading as="h1" {...props} />;
const H2 = (props) => <Heading as="h2" {...props} />;
const H3 = (props) => <Heading as="h3" {...props} />;
const H4 = (props) => <Heading as="h4" {...props} />;
const H5 = (props) => <Heading as="h5" {...props} />;
const H6 = (props) => <Heading as="h6" {...props} />;
const P = (props) => <Box as="p" marginBottom="1rem" {...props} />;
const Aside = (props) => {
  const theme = useTheme();
  return (
    <Box
      borderLeft="8px solid"
      padding="1rem 0 1rem 2rem"
      borderColor={theme.colors.pink[400]}
      backgroundColor={theme.colors.pink[50]}
      margin="2rem 0 2rem -2rem"
      {...props}
    />
  );
};

const Pre = (props) => {
  const classNames = props.children.props.className || '';
  const matches = classNames.match(/language-(?<lang>.*)/);
  return (
    <Highlight
      {...defaultProps}
      theme={prismTheme}
      code={props.children.props.children}
      language={
        matches && matches.groups && matches.groups.lang
          ? matches.groups.lang
          : ''
      }
    >
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre className={className} style={style}>
          {tokens.map((line, i) => (
            <div {...getLineProps({ line, key: i })}>
              {line.map((token, key) => (
                <span {...getTokenProps({ token, key })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  );
};

const components = {
  Aside,
  h1: H1,
  h2: H2,
  h3: H3,
  h4: H4,
  h5: H5,
  h6: H6,
  p: P,
  pre: Pre,
};

// eslint-disable-next-line react/prop-types
const MDXProviderWrapper = ({ children }) => (
  <MDXProvider components={components}>{children}</MDXProvider>
);

export default MDXProviderWrapper;
