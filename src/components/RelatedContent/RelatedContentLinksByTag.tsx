import Link from 'next/link';

import { getTagInformation } from '../../data/ConvertKitTags';

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
    <div className="pb-20 pt-8">
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
