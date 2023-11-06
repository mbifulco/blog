export const getMentions = async (slug: string) => {
  const resp = await fetch(
    `https://webmention.io/api/mentions.json?target=https://mikebifulco.com${slug}`
  );
  const list = await resp.json();

  return list.links;
};
