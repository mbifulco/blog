import { MDXRemote } from 'next-mdx-remote';

import { PublishDate } from '../PublishDate';

import { components } from '../../utils/MDXProviderWrapper';
import TagsSummary from '../tagsSummary';

type Article = {
  frontmatter: {
    date: string;
    url: string;
    title: string;
    tags: string[];
  };
  source: {
    compiledSource: string;
    renderedOutput: string;
  };
};

type ExternalWorkItemProps = {
  article: Article;
  border?: boolean;
};

const ExternalWorkItem = ({ article, border = false }) => {
  const {
    frontmatter: { date, url, title, tags },
  } = article;

  {
    /* note: box shadow from @drucial's https://www.betterneumorphism.com/?h=0&s=0&l=100 */
  }
  return (
    <article className="shadow-2xl p-6 rounded-md flex flex-col">
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
