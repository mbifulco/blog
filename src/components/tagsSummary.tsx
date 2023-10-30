import Tag from './tag';

type TagsSummaryProps = {
  tags: Array<string> | Array<{ name: string }>;
};

const TagsSummary: React.FC<TagsSummaryProps> = ({ tags }) => {
  if (!tags || tags.length <= 0) return null;

  return (
    <div className="flex flex-row text-sm flex-wrap">
      {tags.map((tag, id) => (
        <Tag
          key={`tag-${id || tag?.name || tag}`}
          url={`/tags/${tag?.name || tag}`}
        >
          {tag.name || tag}
        </Tag>
      ))}
    </div>
  );
};

export default TagsSummary;
