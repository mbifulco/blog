import PostSummary from './PostSummary';
import FullPost from './FullPost';

const Post = ({ summary, post }) => {
  if (summary) return <PostSummary post={post} />;
  return <FullPost post={post} />;
};

export default Post;
