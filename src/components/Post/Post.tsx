import type { Series } from '@lib/series';
import type { BlogPost } from '../../data/content-types';
import FullPost from './FullPost';
import PostSummary from './PostSummary';

type PostProps = {
  summary?: boolean;
  post: BlogPost;
  eager?: boolean;
  series?: Series | null;
};

const BlogPostRenderer: React.FC<PostProps> = ({
  summary,
  post,
  eager,
  series,
}) => {
  if (summary) return <PostSummary post={post} eager={eager} />;
  return <FullPost post={post} series={series} />;
};

export default BlogPostRenderer;
