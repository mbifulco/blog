import posthog from 'posthog-js';

import Link from '@components/Link';

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
      <span className="text-riso-pink">#</span>
      <span className="text-ink-muted">{children}</span>
    </div>
  );

  if (url) {
    tag = (
      <Link
        href={url}
        className="cursor-pointer font-futura text-xs font-bold no-underline hover:underline"
        onClick={handleTagClick}
      >
        {tag}
      </Link>
    );
  }
  return tag;
};

export default Tag;
