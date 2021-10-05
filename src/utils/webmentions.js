export const getMentions = async (
  slug,
) => {
  const resp = await fetch(
    `https://webmention.io/api/mentions.json?target=https://mikebifulco.com${slug}`
  );
  const list = await resp.json();

  return list.links;
};
