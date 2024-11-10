import type { BlogPost } from '../../data/content-types';
import NewsletterSignup from '../NewsletterSignup';
import { BlogPost as Post } from '../Post';

type PostFeedProps = {
  posts: BlogPost[];
};

const PostFeed: React.FC<PostFeedProps> = ({ posts }) => (
  <div className="flex flex-col gap-12">
    {posts.map((post, idx) => {
      const postEl = <Post summary key={post.slug} post={post} />;

      if (idx === 1) {
        return (
          <div key="newsletter-wrapper">
            {idx === 1 && (
              <div className="max-w-full">
                <NewsletterSignup key="newsletter" />
              </div>
            )}
            {postEl}
          </div>
        );
      }

      return postEl;
    })}
  </div>
);

export default PostFeed;
