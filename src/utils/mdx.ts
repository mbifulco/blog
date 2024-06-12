import { serialize as serializeMdx } from 'next-mdx-remote/serialize';
import imageSize from 'rehype-img-size';
import rehypeSlug from 'rehype-slug';

export const serialize = async (content: string) => {
  const mdxSource = await serializeMdx(content, {
    mdxOptions: {
      rehypePlugins: [
        [imageSize, { dir: 'public' }],
        rehypeSlug, // add IDs to any h1-h6 tag that doesn't have one, using a slug made from its text
      ],
    },
  });

  return mdxSource;
};

export default serialize;
