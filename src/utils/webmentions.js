export const getMentions = async (
  slug,
) => {
  console.log(slug)
  const resp = await fetch(
    `https://webmention.io/api/mentions.json?target=https://mikebifulco.com${slug}`
  );
  const list = await resp.json();

  console.log(list.links)
  return list.links;
};
