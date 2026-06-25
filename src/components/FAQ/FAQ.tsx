import type { Answer, FAQPage, Question, WithContext } from 'schema-dts';
import React from 'react';

import { Heading } from '@components/Heading';
import clsxm from '@utils/clsxm';
import { reactNodeToText } from '@utils/reactNodeToText';

type FAQItemProps = {
  question: string;
  children: React.ReactNode;
};

/**
 * A single question/answer pair. The `question` prop is read by the parent
 * <FAQ> both to render the heading and to build FAQPage structured data; the
 * children are the (rich MDX) answer.
 */
export const FAQItem: React.FC<FAQItemProps> = ({ question, children }) => (
  <div className="border-b border-gray-200 py-4 last:border-b-0 dark:border-gray-700">
    <Heading as="h3" className="m-0 mb-2 text-xl font-bold">
      {question}
    </Heading>
    <div className="text-pretty [&>p:first-child]:mt-0 [&>p:last-child]:mb-0">
      {children}
    </div>
  </div>
);

type FAQProps = {
  children: React.ReactNode;
  heading?: string;
};

/**
 * Renders an FAQ section and emits matching FAQPage JSON-LD. Use one <FAQ> per
 * post (a page should have a single FAQPage). Children must be <FAQItem>s.
 */
export const FAQ: React.FC<FAQProps> = ({
  children,
  heading = 'Frequently asked questions',
}) => {
  const items = React.Children.toArray(children).filter(
    (child): child is React.ReactElement<FAQItemProps> =>
      React.isValidElement(child) &&
      typeof (child.props as FAQItemProps).question === 'string'
  );

  const faqSchema: WithContext<FAQPage> = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(
      (item): Question => ({
        '@type': 'Question',
        name: item.props.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: reactNodeToText(item.props.children),
        } satisfies Answer,
      })
    ),
  };

  return (
    <section aria-label={heading} className="my-10">
      {items.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            // Escape `<` so answer text containing `</script>` (or `<!--`)
            // can't break out of the script tag. `<` is valid JSON and
            // renders identically.
            __html: JSON.stringify(faqSchema).replace(/</g, '\\u003c'),
          }}
        />
      )}
      <Heading as="h2" className={clsxm('mb-2')}>
        {heading}
      </Heading>
      <div>{children}</div>
    </section>
  );
};
