import type { Article } from '../../data/content-types';
import { Heading } from '../Heading';
import { PublishDate } from '../PublishDate';

type ExternalWorkItemProps = {
  article: Article;
};

const ExternalWorkItem: React.FC<ExternalWorkItemProps> = ({ article }) => {
  const {
    frontmatter: { date, title, excerpt },
  } = article;

  return (
    <article className="max-w-[100vw]">
      <div className="relative">
        <header className="flex flex-col gap-1">
          <Heading as="h2" className="m-0 p-0 text-xl md:text-xl">
            <span className="text-xl text-pink-600">{title}</span>
          </Heading>
          <p>
            <PublishDate date={date} className="text-sm text-gray-500" />
          </p>
        </header>

        {excerpt && <p className="text-md text-balance">{excerpt}</p>}
      </div>
    </article>
  );
};

export default ExternalWorkItem;
