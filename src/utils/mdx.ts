import { serialize as serializeMdx } from 'next-mdx-remote/serialize';
import imageSize from 'rehype-img-size';
import rehypeSlug from 'rehype-slug';
import GithubSlugger from 'github-slugger'
import { Heading } from 'src/data/content-types';


export const getHeadings = (source: string): Heading[] => {
  const lines = source.split('\n');
  let inCodeBlock = false;
  const headings: Heading[] = [];
  const slugger = new GithubSlugger();

  lines.forEach((line) => {
    // Toggle inCodeBlock flag if the line starts with triple backticks
    if (line.trim().startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      return;
    }

    // Skip processing if inside a code block
    if (inCodeBlock) return;

    // Process headings outside of code blocks
    const headingMatch = line.match(/^(#{1,6}) (.+)/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const text = headingMatch[2].trim();
      headings.push({
        level,
        text,
        slug: slugger.slug(text),
      });
    }
  });

  return headings;
};


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
