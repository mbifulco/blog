import { useRouter } from 'next/router';

type WebmentionMetadataProps = {
  coverImageUrl?: string;
  summary?: string;
  author?: string;
  publishedAt?: string | number | Date;
  title?: string;
  tags?: string[];
};

const WebmentionMetadata: React.FC<WebmentionMetadataProps> = ({
  coverImageUrl,
  summary,
  author,
  publishedAt,
  tags,
  title,
}) => {
  const router = useRouter();
  const location = router.asPath;

  const publishDate = publishedAt ? new Date(publishedAt) : new Date();

  return (
    <div
      style={{
        display: 'none',
        height: '0',
      }}
    >
      <article className="h-card h-entry">
        <header>
          {coverImageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img className="u-photo" src={coverImageUrl} alt="Hero" />
          )}
          <div className="p-name">{title}</div>
        </header>
        <p className="p-summary e-content">{summary}</p>
        <a rel="author" className="h-card p-author" href={location}>
          {author ?? 'Mike Bifulco'}
        </a>
        {tags?.map((tag) => (
          <a
            key={`tag-link-${tag}`}
            href={`https://mikebifulco.com/tags/${tag}`}
            rel="category tag"
            className="p-category"
          >
            {tag}
          </a>
        ))}
        <footer>
          <a className="u-url p-name" href={location || ''}>
            {author ?? 'Mike Bifulco'}
          </a>
        </footer>
        <time
          className="dt-published"
          itemProp="datepublished"
          dateTime={publishDate.toISOString()}
        >
          {`${publishDate.toISOString().replace('Z', '')}+01:00`}
        </time>
      </article>
    </div>
  );
};

export default WebmentionMetadata;
