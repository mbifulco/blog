import PostSummary from './PostSummary';
import FullPost from './FullPost';
import { BlogPost } from '../../data/content-types';

type PostProps = {
  summary?: boolean;
  post: BlogPost;
  eager?: boolean;
};

const BlogPost: React.FC<PostProps> = ({ summary, post, eager }) => {
  if (summary) return <PostSummary post={post} eager={eager} />;
  return <FullPost post={post} />;
};

export default BlogPost;
