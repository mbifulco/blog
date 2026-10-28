const WORDS_PER_MINUTE = 230;

/** Estimated minutes to read MDX source, ignoring fenced code, JSX tags, and markup. Never less than 1. */
export const readingMinutes = (mdx: string): number => {
  const prose = mdx
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[#*_>`[\]()!-]/g, ' ');
  const words = prose.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
};
