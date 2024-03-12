// Components
import type { GetStaticProps, NextPage } from 'next';

import { Heading } from '../../components/Heading';
import { NewsletterHero } from '../../components/NewsletterSignup';
import SEO from '../../components/seo';
import Tag from '../../components/tag';
import { getAllTags } from '../../lib/tags';

export const getStaticProps: GetStaticProps = async () => {
  const tags = await getAllTags();
  return {
    props: {
      tags: Array.from(tags.allTags).sort(),
    },
  };
};

type TagsPageProps = {
  tags: string[];
};

const TagsPage: NextPage<TagsPageProps> = ({ tags }) => {
  return (
    <>
      <main className="mx-auto flex max-w-5xl flex-col gap-8">
        <SEO title="Browse all tags used on articles" />
        <Heading as="h1">
          All <span className="text-gray-400">#</span>
          tags used on articles across the site
        </Heading>
        <div className="mb-20 flex flex-row flex-wrap gap-2 text-xl">
          {tags?.map((tag) => (
            <Tag key={`tag-cloud-${tag}`} url={`/tags/${tag}/`}>
              {tag}
            </Tag>
          ))}
        </div>
      </main>
      <NewsletterHero />
    </>
  );
};

export default TagsPage;
