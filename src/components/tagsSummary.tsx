import Tag from './tag';

type TagsSummaryProps = {
  tags?: string[];
};

const TagsSummary: React.FC<TagsSummaryProps> = ({ tags }) => {
  if (!tags || tags.length <= 0) return null;

  return (
    <div className="flex flex-row text-sm flex-wrap">
      {tags.map((tag, id) => {
        if (!tag) return null;
        return (
          <Tag key={`tag-${id || tag}`} url={`/tags/${tag}`}>
            {tag}
          </Tag>
        );
      })}
    </div>
  );
};

export default TagsSummary;
