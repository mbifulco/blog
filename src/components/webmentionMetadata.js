import React from 'react';
import PropTypes from 'prop-types';

const WebmentionMetadata = ({
  coverImageUrl,
  summary,
  location,
  author,
  publishedAt,
  title,
}) => {
  return (
    <div
      style={{
        display: 'none',
      }}
    >
      <article className="h-card">
        <header>
          {coverImageUrl && (
            <img className="u-photo" src={coverImageUrl} alt="Hero" />
          )}
          <h1 className="p-name">{title}</h1>
        </header>
        <p className="p-summary e-content">{summary}</p>
        <footer>
          <a className="u-url p-name" href={location.href}>
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
  location: PropTypes.shape({
    href: PropTypes.string,
  }),
  author: PropTypes.string,
  publishedAt: PropTypes.string,
  title: PropTypes.string,
};

export default WebmentionMetadata;
