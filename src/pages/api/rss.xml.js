import { getAllPosts } from '../../lib/blog';
import { generateRSSFeed } from '../../utils/rss';

export default async function handler(req, res) {
  const posts = await getAllPosts();
  const feed = generateRSSFeed(posts);

  res.setHeader('Content-Type', 'text/xml').status(200).send(feed);
}
