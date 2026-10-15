import type { Article, DocumentSummary } from '../../data/content-types';

import { Heading } from '../Heading';
import { PublishDate } from '../PublishDate';

type ExternalWorkItemProps = {
  article: DocumentSummary<Article>;
};

const ExternalWorkItem: React.FC<ExternalWorkItemProps> = ({ article }) => {
  const {
    frontmatter: { date, title, excerpt },
  } = article;

  return (
    <article className="min-w-0 max-w-full">
      <div className="relative">
        <header className="flex flex-col gap-1">
          <Heading as="h2" className="m-0 p-0 text-xl md:text-xl">
            <span className="text-riso-blue text-xl">{title}</span>
          </Heading>
          <p>
            <PublishDate
              date={date}
              className="text-ink-muted font-mono text-xs"
            />
          </p>
        </header>

        {excerpt && <p className="text-md text-balance">{excerpt}</p>}
      </div>
    </article>
  );
};

export default ExternalWorkItem;
