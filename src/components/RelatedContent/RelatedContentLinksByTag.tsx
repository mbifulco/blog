import Link from 'next/link';

const tagLabels: Record<string, string> = {
  react: 'about React.js',
  remix: 'about Remix.run',
  nextjs: 'about Next.js',
  founders: 'for startup founders',
  creators: 'for creators',
  developer: 'for developers',
  gatsby: 'about Gatsby',
  css: 'about CSS',
  ux: 'about User Experience (UX)',
  designer: 'for designers',
  productivity: 'about productivity',
  tools: 'about tools I use',
  cycling: 'about cycling',
  javascript: 'for JavaScript developers',
  'mental health': 'mental health and mindfulness',
  design: 'about design',
};

const getTagInformation = (tag: string) => ({
  name: tag,
  label: tagLabels[tag] || `about ${tag}`,
});

const DEFAULT_TAGS_TO_DISPLAY = [
  'react',
  'remix',
  'nextjs',
  'developer',
  'javascript',
  'design',
  'css',
  'ux',
  'tools',
  'productivity',
];

const RelatedContentLinksByTag = ({ tags = DEFAULT_TAGS_TO_DISPLAY }) => {
  return (
    <div className="pt-8 pb-20">
      <p className="font-bold">More great resources</p>
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
