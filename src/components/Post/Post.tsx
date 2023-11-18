import type { BlogPost } from '../../data/content-types';
import FullPost from './FullPost';
import PostSummary from './PostSummary';

type PostProps = {
  summary?: boolean;
  post: BlogPost;
  eager?: boolean;
};

const BlogPostRenderer: React.FC<PostProps> = ({ summary, post, eager }) => {
  if (summary) return <PostSummary post={post} eager={eager} />;
  return <FullPost post={post} />;
};

export default BlogPostRenderer;
