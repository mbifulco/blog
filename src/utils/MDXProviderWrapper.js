/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { MDXProvider } from '@mdx-js/react';
import { MDXEmbedProvider } from 'mdx-embed';

import {
  Button,
  Code,
  Flex,
  Box,
  Heading,
  Link,
  Stack,
  Text,
  useTheme,
} from '@chakra-ui/react';
import PrismHighlight, { defaultProps } from 'prism-react-renderer';
import prismTheme from 'prism-react-renderer/themes/nightOwl';

import { Image } from '../components';

// one off component imports
import { CenteredTextDemo } from '../components/demos/CenteredTextDemo';

const H1 = (props) => <Heading as="h1" {...props} />;
const H2 = (props) => <Heading as="h2" {...props} />;
const H3 = (props) => <Heading as="h3" {...props} />;
const H4 = (props) => <Heading as="h4" {...props} />;
const H5 = (props) => <Heading as="h5" {...props} />;
const H6 = (props) => <Heading as="h6" {...props} />;
const P = (props) => (
  <Box as="p" marginTop="1rem" marginBottom="1rem" {...props} />
);

const CustomLink = (props) => {
  const theme = useTheme();
  return <Link color={theme.colors.pink[600]} {...props} />;
};

const Colophon = () => {
  const theme = useTheme();
  return (
    <Flex
      direction="row"
      justifyContent="center"
      aria-hidden="true"
      color={theme.colors.pink[400]}
      fontWeight="bold"
      margin="3rem 0 1.5rem"
    >
      <Stack direction="row" spacing="1.25rem">
        <Text>*</Text>
        <Text>*</Text>
        <Text>*</Text>
      </Stack>
    </Flex>
  );
};

const Aside = (props) => {
  const theme = useTheme();

  const colors = {
    default: theme.colors.pink,
    info: theme.colors.yellow,
    note: theme.colors.green,
    error: theme.colors.red,
    warning: theme.colors.red,
  };

  const selectedColor = colors[props.type] || colors.default;

  return (
    <Box
      borderLeft="8px solid"
      padding="1rem 0 1rem 2rem"
      borderColor={selectedColor[400]}
      backgroundColor={selectedColor[50]}
      margin="2rem 0 2rem -2rem"
      color={theme.colors.gray[900]}
      {...props}
    />
  );
};

const Highlight = (props) => <Text as="mark" {...props} />;

const InlineCode = (props) => {
  const theme = useTheme();

  return (
    <Code
      color={theme.colors.gray[900]}
      whiteSpace="pre"
      borderRadius=".3em"
      padding="0.1ch 1ch"
      {...props}
    />
  );
};

const Pre = (props) => {
  const classNames = props.children.props.className || '';
  const matches = classNames.match(/language-(?<lang>.*)/);
  return (
    <Box marginBottom="2rem" marginTop="2rem">
      <PrismHighlight
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
          <pre className={className} style={{ ...style, overflowX: 'scroll' }}>
            {tokens.map((line, i) => {
              // TODO: why is this needed though?
              if (i === tokens.length - 1) return null;
              return (
                // eslint-disable-next-line react/jsx-key
                <div {...getLineProps({ line, key: i })}>
                  {line.map((token, key) => (
                    // eslint-disable-next-line react/jsx-key
                    <span {...getTokenProps({ token, key })} />
                  ))}
                </div>
              );
            })}
          </pre>
        )}
      </PrismHighlight>
    </Box>
  );
};

const components = {
  Aside,
  Button,
  Colophon,
  Highlight,
  Image,
  inlineCode: InlineCode,
  a: CustomLink,
  h1: H1,
  h2: H2,
  h3: H3,
  h4: H4,
  h5: H5,
  h6: H6,
  p: P,
  pre: Pre,
};

/* eslint-disable max-len */
/* 
  NOTE: due to a quirk in the mdx strategy we're using currently, we are unable to `import` components within mdx files.
        To support that, they need to be added here. I'm keeping them in a separate object to track for later use, on the off chance this gets fixed one day.
        I also recommend continuing to add `import` lines to individual mdx files to reduce work later - they don't seem to break anything right now
  
  for more context, https://github.com/hashicorp/next-mdx-remote#import--export
*/
const oneOffComponentsUsedInPosts = {
  CenteredTextDemo, // used in dont-center-paragraph-text.mdx
};
/* eslint-enable max-len */

// eslint-disable-next-line react/prop-types
const MDXProviderWrapper = ({ children }) => (
  <MDXEmbedProvider>
    <MDXProvider components={{ ...components, ...oneOffComponentsUsedInPosts }}>
      {children}
    </MDXProvider>
  </MDXEmbedProvider>
);

export default MDXProviderWrapper;
