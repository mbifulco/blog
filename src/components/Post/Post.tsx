import type { Series } from '@lib/series';
import type { TopicDefinition } from '@lib/topics';
import type {
  BlogPost,
  DocumentSummary,
  RenderedDocument,
} from '../../data/content-types';

import FullPost from './FullPost';
import PostSummary from './PostSummary';

type PostProps = {
  eager?: boolean;
  series?: Series | null;
  topic?: Pick<TopicDefinition, 'slug' | 'name'> | null;
} & (
  | { summary: true; post: DocumentSummary<BlogPost> }
  | { summary?: false; post: RenderedDocument<BlogPost> }
);

const BlogPostRenderer: React.FC<PostProps> = (props) => {
  if (props.summary) {
    return <PostSummary post={props.post} eager={props.eager} />;
  }
  return (
    <FullPost post={props.post} series={props.series} topic={props.topic} />
  );
};

export default BlogPostRenderer;
