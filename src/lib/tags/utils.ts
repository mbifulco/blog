/**
 * Parses and normalizes a tag string
 * Converts spaces to hyphens and makes lowercase
 *
 * @param tag - The tag string to parse
 * @returns string - The normalized tag
 */
export const parseTag = (tag: string): string => {
  return tag.split(' ').join('-').toLocaleLowerCase();
};
