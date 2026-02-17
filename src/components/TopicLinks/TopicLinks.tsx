import Link from '@components/Link';
import { Subtitle } from '@components/Subtitle';
import type { TopicDefinition } from '@lib/topics';

type TopicLinksProps = {
  topics: TopicDefinition[];
};

const TopicLinks: React.FC<TopicLinksProps> = ({ topics }) => {
  return (
    <div>
      <Subtitle>Browse by Topic</Subtitle>
      <div className="mt-3 flex flex-wrap gap-3">
        {topics.map((topic) => (
          <Link
            key={topic.slug}
            href={`/topics/${topic.slug}`}
            className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 no-underline transition-colors hover:border-pink-600 hover:text-pink-600"
          >
            {topic.icon && <span aria-hidden="true">{topic.icon}</span>}
            {topic.name}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TopicLinks;
