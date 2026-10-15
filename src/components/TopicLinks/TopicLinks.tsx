import type { TopicDefinition } from '@lib/topics';

import Link from '@components/Link';

type TopicLinksProps = {
  topics: TopicDefinition[];
};

const TopicLinks: React.FC<TopicLinksProps> = ({ topics }) => {
  return (
    <div>
      <h2 className="text-riso-blue m-0 font-futura text-2xl font-bold">
        Browse by topic
      </h2>
      <div className="mt-4 flex flex-wrap gap-3">
        {topics.map((topic) => (
          <Link
            key={topic.slug}
            href={`/topics/${topic.slug}`}
            className="border-riso-blue text-riso-blue hover:border-riso-pink hover:bg-pink-fill hover:text-on-fill inline-flex items-center gap-1.5 border-2 px-4 py-2 font-futura text-sm font-bold no-underline transition-colors"
          >
            {topic.name}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TopicLinks;
