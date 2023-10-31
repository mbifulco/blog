import Link from 'next/link';

type TagProps = {
  children: React.ReactNode;
  url?: string;
};

const Tag: React.FC<TagProps> = ({ children, url }) => {
  let tag = (
    <div className="flex mr-2 gap-0">
      <span className="text-gray-400">#</span>
      <span className="text-gray-700">{children}</span>
    </div>
  );

  if (url) {
    tag = (
      <Link href={url} className="text-sm text-gray hover:underline">
        {tag}
      </Link>
    );
  }
  return tag;
};

export default Tag;
