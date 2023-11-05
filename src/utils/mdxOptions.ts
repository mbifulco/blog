import imageSize from 'rehype-img-size';
import rehypeSlug from 'rehype-slug';

const mdxOptions = {
  mdxOptions: {
    rehypePlugins: [
      [imageSize, { dir: 'public' }],
      rehypeSlug, // add IDs to any h1-h6 tag that doesn't have one, using a slug made from its text
    ],
  },
};

export default mdxOptions;
