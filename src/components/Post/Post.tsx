import type { Series } from '@lib/series';
import type { TopicDefinition } from '@lib/topics';
import type { BlogPost } from '../../data/content-types';

import FullPost from './FullPost';
import PostSummary from './PostSummary';

type PostProps = {
  summary?: boolean;
  post: BlogPost;
  eager?: boolean;
  series?: Series | null;
  topic?: Pick<TopicDefinition, 'slug' | 'name'> | null;
};

const BlogPostRenderer: React.FC<PostProps> = ({
  summary,
  post,
  eager,
  series,
  topic,
}) => {
  if (summary) return <PostSummary post={post} eager={eager} />;
  return <FullPost post={post} series={series} topic={topic} />;
};

export default BlogPostRenderer;
