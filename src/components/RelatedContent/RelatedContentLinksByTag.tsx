import Link from 'next/link';

import topTagsData from '@data/generated/topTags.json';

const tagLabels: Record<string, string> = {
  react: 'about React.js',
  nextjs: 'about Next.js',
  typescript: 'about TypeScript',
  javascript: 'for JavaScript developers',
  founders: 'for startup founders',
  founder: 'for startup founders',
  creators: 'for creators',
  developer: 'for developers',
  dev: 'for developers',
  css: 'about CSS',
  ux: 'about User Experience (UX)',
  designer: 'for designers',
  productivity: 'about productivity',
  tools: 'about tools I use',
  tutorial: 'tutorials & guides',
  design: 'about design',
  startup: 'about startups',
  product: 'about product development',
  philosophy: 'about philosophy & mindset',
  psychology: 'about psychology',
  video: 'video content',
};

const getTagInformation = (tag: string) => ({
  name: tag,
  label: tagLabels[tag] || `about ${tag}`,
});

// Tags to exclude from the footer (meta-tags, not topics)
const EXCLUDED_TAGS = ['newsletter'];

// Get top tags from generated data, filtering out excluded tags
const getDefaultTags = (): string[] => {
  return topTagsData.tags
    .filter((t) => !EXCLUDED_TAGS.includes(t.tag))
    .slice(0, 10)
    .map((t) => t.tag);
};

const RelatedContentLinksByTag = ({ tags = getDefaultTags() }) => {
  return (
    <div className="pt-8 pb-20">
      <p className="font-bold">Explore by topic</p>
      <div className="grid grid-cols-1 text-lg sm:grid-cols-2">
        {tags.map((tag) => {
          const tagInformation = getTagInformation(tag);
          if (!tagInformation) return null;

          return (
            <Link
              className="underline hover:no-underline"
              href={`/tags/${tag}`}
              key={`related-content-${tag}`}
            >
              {`Articles ${tagInformation.label}`}
            </Link>
          );
        })}
        <Link className="text-pink underline hover:no-underline" href={`/tags`}>
          Browse all topics &rarr;
        </Link>
      </div>
    </div>
  );
};

export default RelatedContentLinksByTag;
