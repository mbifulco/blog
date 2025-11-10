import * as React from 'react';
import {
  Button,
  CodeBlock,
  CodeInline,
  Column,
  dracula,
  Img,
  Link,
  Row,
  Text,
} from '@react-email/components';

import {
  button,
  codeBlock,
  codeInline,
  EmailLayout,
  paragraph,
} from './EmailLayout';
import { H1, H2, H3, H4, H5, H6 } from '../components/Heading';

/**
 * Example email template showing how to use EmailLayout.
 *
 * Usage:
 * ```tsx
 * import { ExampleEmail } from './templates/ExampleEmail';
 * import { render } from '@react-email/render';
 *
 * // With greeting (default: "Hey there,")
 * const html = await render(<ExampleEmail firstName="Jane" />);
 *
 * // Without greeting
 * const html = await render(<ExampleEmail firstName={false} />);
 * ```
 */

type ExampleEmailProps = {
  firstName?: string | false;
};

export const ExampleEmail = ({ firstName }: ExampleEmailProps) => {
  return (
    <EmailLayout
      preview="This is the preview text shown in email clients"
      firstName={firstName}
    >
      <Row>
        <Column>
          <H1>H1: Main Heading</H1>
          <Text style={paragraph}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. This
            demonstrates how body text flows after a main heading.
          </Text>

          <H2>H2: Secondary Heading</H2>
          <Text style={paragraph}>
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
            nisi ut aliquip ex ea commodo consequat. Notice how the spacing
            feels natural between headings and paragraphs.
          </Text>

          <H3>H3: Tertiary Heading</H3>
          <Text style={paragraph}>
            Duis aute irure dolor in reprehenderit in voluptate velit esse
            cillum dolore eu fugiat nulla pariatur. This paragraph shows{' '}
            <b>bold text</b> and <i>italic text</i>.
          </Text>

          <H4>H4: Quaternary Heading</H4>
          <Text style={paragraph}>
            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
            officia deserunt mollit anim id est laborum. You can also include{' '}
            <Link href="https://mikebifulco.com" className="text-pink-600">
              inline links
            </Link>{' '}
            within paragraphs.
          </Text>

          <H5>H5: Fifth Level Heading</H5>
          <Text style={paragraph}>
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem
            accusantium doloremque laudantium, totam rem aperiam.
          </Text>

          <H6>H6: Sixth Level Heading</H6>
          <Text style={paragraph}>
            Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut
            fugit, sed quia consequuntur magni dolores eos qui ratione
            voluptatem sequi nesciunt.
          </Text>

          <Text style={paragraph}>Here's an unordered list:</Text>
          <ul style={{ paddingLeft: 20, marginTop: 0 }}>
            <li style={paragraph}>First unordered item</li>
            <li style={paragraph}>
              Second unordered item with <b>bold</b>
            </li>
            <li style={paragraph}>
              Third item with a{' '}
              <Link
                href="https://mikebifulco.com/newsletter"
                className="text-pink-600"
              >
                link
              </Link>
            </li>
          </ul>

          <Text style={paragraph}>And here's an ordered list:</Text>
          <ol style={{ paddingLeft: 20, marginTop: 0 }}>
            <li style={paragraph}>First ordered item</li>
            <li style={paragraph}>
              Second ordered item with <i>italics</i>
            </li>
            <li style={paragraph}>Third ordered item</li>
          </ol>

          <Text style={paragraph}>
            You can use inline code like{' '}
            <CodeInline style={codeInline}>npm install</CodeInline> or{' '}
            <CodeInline style={codeInline}>const foo = 'bar'</CodeInline> within
            your paragraphs.
          </Text>

          <Text style={paragraph}>And here's a code block:</Text>
          <CodeBlock
            code={`function greet(name) {
  return \`Hello, \${name}!\`;
}

console.log(greet('World'));`}
            language="javascript"
            theme={dracula}
            style={{ ...codeBlock, marginTop: 8, marginBottom: 8 }}
          />

          <Text style={paragraph}>You can also include images:</Text>
          <Img
            src="https://placehold.co/600x300"
            alt="Example placeholder image"
            width={600}
            height={300}
            style={{
              maxWidth: '100%',
              height: 'auto',
              marginTop: 8,
              marginBottom: 4,
            }}
          />
          <Text
            style={{
              fontSize: 14,
              color: 'rgb(0,0,0, 0.6)',
              fontStyle: 'italic',
              marginTop: 0,
            }}
          >
            Figure 1: This is an example image caption that provides context
            about the image above.
          </Text>

          <Text style={paragraph}>
            Cheers,
            <br />
            Mike
          </Text>
        </Column>
      </Row>
      <Row>
        <Column className="pb-8" align="center">
          <Button
            style={button}
            className="mx-auto w-fit"
            href="https://mikebifulco.com"
          >
            Visit my site
          </Button>
        </Column>
      </Row>
    </EmailLayout>
  );
};

export default ExampleEmail;
