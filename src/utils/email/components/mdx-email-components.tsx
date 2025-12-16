import {
  Heading,
  Hr,
  Link,
  Text,
} from '@react-email/components';
import type { MDXComponents } from 'mdx/types';

import { ImageEmail } from './ImageEmail';
import { SponsoredSectionEmail } from './SponsoredSectionEmail';

/**
 * Email-safe MDX component mappings for newsletters.
 * These components use @react-email/components for maximum email client compatibility.
 */
export const mdxEmailComponents: MDXComponents = {
  // Headings
  h1: (props) => (
    <Heading
      as="h1"
      style={{ fontWeight: 500, paddingTop: 20, fontSize: '2rem' }}
      {...props}
    />
  ),
  h2: (props) => (
    <Heading
      as="h2"
      style={{ fontWeight: 500, paddingTop: 20, fontSize: '2rem' }}
      {...props}
    />
  ),
  h3: (props) => (
    <Heading
      as="h3"
      style={{ fontWeight: 500, paddingTop: 20, fontSize: '1.75rem' }}
      {...props}
    />
  ),
  h4: (props) => (
    <Heading
      as="h4"
      style={{ fontWeight: 500, paddingTop: 20, fontSize: '1.5rem' }}
      {...props}
    />
  ),
  h5: (props) => (
    <Heading
      as="h5"
      style={{ fontWeight: 500, paddingTop: 20, fontSize: '1.25rem' }}
      {...props}
    />
  ),
  h6: (props) => (
    <Heading
      as="h6"
      style={{ fontWeight: 500, paddingTop: 20, fontSize: '1rem' }}
      {...props}
    />
  ),

  // Paragraphs
  p: (props) => (
    <Text
      style={{ fontSize: '1.25rem', lineHeight: 1.4, marginTop: 16, marginBottom: 16 }}
      {...props}
    />
  ),

  // Links
  a: (props) => (
    <Link
      style={{ color: '#007bff', textDecoration: 'underline' }}
      {...props}
    />
  ),

  // Horizontal rule
  hr: () => <Hr />,

  // Custom components
  Image: ImageEmail,
  SponsoredSection: SponsoredSectionEmail,
};
