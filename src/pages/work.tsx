import type { NextPage } from 'next';
import type { GetStaticProps } from 'next';

import { ExternalWorkItem } from '../components/ExternalWork';
import SEO from '../components/seo';

import { getAllExternalReferences } from '../lib/external-references';
import type { Article } from '../data/content-types';

export const getStaticProps: GetStaticProps = async () => {
  const articles = await getAllExternalReferences();

  return {
    props: {
      articles,
    },
  };
};

type WorkPageProps = {
  articles: Article[];
};

const WorkPage: NextPage<WorkPageProps> = ({ articles }) => {
  return (
    <>
      <SEO title="My work from around the web" canonical="/work" />
      <div className="flex flex-row gap-4">
        <h1 className="font-bold text-4xl">Some samples of my work online</h1>
        <div>
          <p className="mb-8">
            This page contains articles, videos, and other references to my work
            over the years. {"I'm"} extremely lucky to be able to say that the
            nature of some of my work is that it is recorded for the public to
            see, and that {"I've"} made news headlines from time to time (for
            good reasons!) &mdash; {"there's"} quite a bit of my work that{' '}
            {"isn't"} represented here, too. {"I'm"} always happy to talk shop.{' '}
            <a href="mailto:hello@mikebifulco.com">drop me a line</a> if{' '}
            {"you'd"} like to know more!
          </p>
        </div>
        <div className="flex flex-col gap-8">
          {articles?.map((article) => (
            <ExternalWorkItem article={article} key={article.slug} />
          ))}
        </div>
      </div>
    </>
  );
};

export default WorkPage;
