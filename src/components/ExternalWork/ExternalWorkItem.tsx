import { MDXRemote } from 'next-mdx-remote';

import type { Article } from '../../data/content-types';
import { components } from '../../utils/MDXProviderWrapper';
import { PublishDate } from '../PublishDate';
import TagsSummary from '../tagsSummary';

type ExternalWorkItemProps = {
  article: Article;
};

const ExternalWorkItem: React.FC<ExternalWorkItemProps> = ({ article }) => {
  const {
    frontmatter: { date, title, tags },
  } = article;

  {
    /* note: box shadow from @drucial's https://www.betterneumorphism.com/?h=0&s=0&l=100 */
  }
  return (
    <article className="flex flex-col rounded-md p-6 shadow-2xl">
      <h2 className="mb-0 text-2xl font-bold">{title}</h2>
      <p className="mt-0 text-pink-500">
        <PublishDate date={date} />
      </p>
      <TagsSummary tags={tags} />
      <MDXRemote {...article.source} components={components} />
    </article>
  );
};

export default ExternalWorkItem;
