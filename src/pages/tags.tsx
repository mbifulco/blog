// Components
import type { GetStaticProps, NextPage } from 'next';

import { getAllTags } from '../lib/tags';

import Tag from '../components/tag';
import { NewsletterSignup } from '../components/NewsletterSignup';
import SEO from '../components/seo';
import { Heading } from '../components/Heading';

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
      <SEO title="Browse all tags used on articles" />
      <Heading as="h1">
        All <span className="text-gray-400">#</span>
        tags used on articles across the site
      </Heading>
      <div className="flex flex-row gap-2 flex-wrap text-xl">
        {tags?.map((tag) => (
          <Tag key={`tag-cloud-${tag}`} url={`/tags/${tag}/`}>
            {tag}
          </Tag>
        ))}
      </div>
      <NewsletterSignup />
    </>
  );
};

export default TagsPage;
