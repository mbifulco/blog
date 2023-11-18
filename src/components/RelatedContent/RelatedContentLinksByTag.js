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
    <div className="pt-8 pb-20">
      <p className="font-bold">More great resources</p>
      <grid className="text-lg grid grid-rows-1 md:grid-rows-5">
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
      </grid>
    </div>
  );
};

export default RelatedContentLinksByTag;
