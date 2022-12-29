import PostSummary from './PostSummary';
import FullPost from './FullPost';

const Post = ({ summary, post, eager }) => {
  if (summary) return <PostSummary post={post} eager={eager} />;
  return <FullPost post={post} />;
};

export default Post;
