export type WebMention = {
  source: string;
  verified: boolean;
  verified_date: string;
  id: number;
  private: boolean;
  data: {
    author: {
      name: string;
      url: string;
      photo: string;
    };
    url: string;
    name: string;
    content: string;
    published: string;
    published_ts: number;
  };
  activity: {
    type: string;
    sentence_html: string;
    sentence_text: string;
  };
  target: string;
};

export const getMentions = async (slug: string) => {
  const resp = await fetch(
    `https://webmention.io/api/mentions.json?target=https://mikebifulco.com${slug}`
  );
  const list = (await resp.json()) as { links: WebMention[] };

  return list.links;
};

export default getMentions;
