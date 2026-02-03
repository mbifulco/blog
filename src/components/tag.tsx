import Link from '@components/Link';
import posthog from 'posthog-js';

type TagProps = {
  children: React.ReactNode;
  url?: string;
};

const Tag: React.FC<TagProps> = ({ children, url }) => {
  const handleTagClick = () => {
    posthog.capture('tag_clicked', {
      tag_name: typeof children === 'string' ? children : String(children),
      tag_url: url,
    });
  };

  let tag = (
    <div className="mr-2 flex gap-0">
      <span className="text-gray-400">#</span>
      <span className="text-gray-700">{children}</span>
    </div>
  );

  if (url) {
    tag = (
      <Link
        href={url}
        className="text-gray text-md cursor-pointer hover:underline"
        onClick={handleTagClick}
      >
        {tag}
      </Link>
    );
  }
  return tag;
};

export default Tag;
