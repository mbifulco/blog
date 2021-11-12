import PropTypes from 'prop-types';

const frontmatterType = PropTypes.shape({
  author: PropTypes.string,
  coverImageUrl: PropTypes.string,
  excerpt: PropTypes.string,
  publishedAt: PropTypes.string,
  title: PropTypes.string,
  tags: PropTypes.arrayOf(PropTypes.string),
  published: PropTypes.bool,
  date: PropTypes.string,
});

export default frontmatterType;
