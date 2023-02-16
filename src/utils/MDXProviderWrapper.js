/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { MDXProvider } from '@mdx-js/react';

import NextLink from 'next/link';
import Script from 'next/script';

import {
  Button,
  Code,
  Flex,
  Box,
  Heading,
  Link,
  ListItem,
  OrderedList,
  SimpleGrid,
  Stack,
  Text,
  UnorderedList,
  useTheme,
} from '@chakra-ui/react';
import PrismHighlight, { defaultProps } from 'prism-react-renderer';
import prismTheme from 'prism-react-renderer/themes/nightOwl';

import { Image } from '../components/Image';
import { SponsoredSection } from '../components/SponsoredSection';

import { Tweet, YouTube, Vimeo } from '../components/MdxEmbed';

// one off component imports
import { CenteredTextDemo } from '../components/demos/CenteredTextDemo';
import { OrtonEffectImage } from '../components/demos/OrtonEffectImage';

const CustomHeading = ({ as, id, ...props }) => {
  if (id) {
    return (
      <Link as={NextLink} href={`#${id}`} _hover={{ textDecoration: 'none' }}>
        <Heading
          as={as}
          display="inline"
          id={id}
          lineHeight={'1em'}
          {...props}
          _hover={{
            _before: {
              fontSize: '1em',
              display: 'inline',
              content: '"#"',
              fontSize: 'smaller',
              color: 'pink.600',
              position: 'relative',
              marginLeft: '-1.2ch',
              paddingRight: '0.2ch',
              textDecoration: 'none',
              borderBottom: 0,
            },
          }}
        />
      </Link>
    );
  }
  return <Heading as={as} {...props} />;
};

const allHeadingstyleProps = {
  lineHeight: '1.2em',
};

/**
 * note: we force H1 -> H2, because all H1s on the site are rendered
 * directly in page templates. We only want 1 possible H1 per page, so this
 * intentionally bumps them down. Leaving a data- attribute to render in HTML
 * in case I ever run into this as a problem 🤣
 */
const H1 = (props) => (
  <CustomHeading
    data-mike-h1-to-h2-in-mdxproviderwrapper
    as="h2"
    size="lg"
    {...allHeadingstyleProps}
    {...props}
  />
);
const H2 = (props) => (
  <CustomHeading as="h2" size="lg" {...allHeadingstyleProps} {...props} />
);
const H3 = (props) => (
  <CustomHeading as="h3" size="md" {...allHeadingstyleProps} {...props} />
);
const H4 = (props) => (
  <CustomHeading as="h4" size="md" {...allHeadingstyleProps} {...props} />
);
const H5 = (props) => (
  <CustomHeading as="h5" size="md" {...allHeadingstyleProps} {...props} />
);
const H6 = (props) => (
  <CustomHeading as="h6" size="md" {...allHeadingstyleProps} {...props} />
);
const P = (props) => (
  <Box as="p" marginTop="1rem" marginBottom="1.5rem" {...props} />
);

const Blockquote = ({ children }) => {
  const theme = useTheme();
  return (
    <Text
      as="blockquote"
      paddingLeft="1.5rem"
      paddingRight="1.5rem"
      backgroundColor={theme.colors.gray[100]}
      borderLeft={`5px solid ${theme.colors.pink[400]}`}
    >
      {children}
    </Text>
  );
};

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
      padding="1rem 2rem"
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
      colorScheme={'facebook'}
      verticalAlign="middle"
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

const ListItemComponent = ({ children, ...rest }) => (
  <ListItem {...rest} ml="1.25rem">
    {children}
  </ListItem>
);

const HorizontalRule = ({ height = 40, width = 250, color = 'pink' }) => {
  const theme = useTheme();
  return (
    <Box
      alignContent={'center'}
      justifyContent={'center'}
      display={'flex'}
      borderBottom={`5px solid ${theme.colors[color][400]}`}
      maxW={'50%'}
      w={'50%'}
      marginTop="3rem"
      marginBottom="2rem"
      alignSelf={'center'}
    />
  );
};

export const customComponents = {
  Aside,
  blockquote: Blockquote,
  Button,
  Colophon,
  Highlight,
  Image,
  code: InlineCode,
  a: CustomLink,
  blockquote: Aside,
  h1: H1,
  h2: H2,
  h3: H3,
  h4: H4,
  h5: H5,
  h6: H6,
  hr: HorizontalRule,
  li: ListItemComponent,
  ol: OrderedList,
  p: P,
  pre: Pre,
  Script,
  SimpleGrid,
  SponsoredSection,
  ul: UnorderedList,
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
  OrtonEffectImage, // used in orton-effect-css-react.mdx
};
/* eslint-enable max-len */

export const components = {
  ...customComponents,
  ...oneOffComponentsUsedInPosts,
  Tweet,
  YouTube,
  Vimeo,
};

// eslint-disable-next-line react/prop-types
const MDXProviderWrapper = ({ children }) => (
  <MDXProvider components={components}>{children}</MDXProvider>
);

export default MDXProviderWrapper;
