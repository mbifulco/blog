import React from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';

const WebmentionMetadata = ({
  coverImageUrl,
  summary,
  author,
  publishedAt,
  tags,
  title,
}) => {
  const router = useRouter();
  const location = router.asPath;

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
          <h1 className="p-name">{title}</h1>
        </header>
        <p className="p-summary e-content">{summary}</p>
        <a rel="author" className="h-card p-author" href={location}>
          {author || 'Mike Bifulco'}
        </a>
        {tags?.map((tag) => (
          <a
            key={`tag-link-${tag.name || tag}`}
            href={`https://mikebifulco.com/tags/${tag.name || tag}`}
            rel="category tag"
            className="p-category"
          >
            {tag.name || tag}
          </a>
        ))}
        <footer>
          <a className="u-url p-name" href={location || ''}>
            {author || 'Mike Bifulco'}
          </a>
        </footer>
        <time
          className="dt-published"
          itemProp="datepublished"
          dateTime={publishedAt}
        >
          {`${new Date(publishedAt || null)
            .toISOString()
            .replace('Z', '')}+01:00`}
        </time>
      </article>
    </div>
  );
};

WebmentionMetadata.propTypes = {
  coverImageUrl: PropTypes.string,
  summary: PropTypes.string,
  author: PropTypes.string,
  publishedAt: PropTypes.string,
  title: PropTypes.string,
};

export default WebmentionMetadata;
