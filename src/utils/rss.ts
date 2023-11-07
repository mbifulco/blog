import { Feed } from 'feed';
import fs from 'fs';

import config from '../config';

export const generateRSSFeed = (posts, newsletters) => {
  if (process.env.NODE_ENV === 'development') {
    return;
  }

  const { author, description, siteUrl, title } = config;

  const feed = new Feed({
    id: siteUrl,
    copyright: `All rights reserved ${new Date().getFullYear()}, Mike Bifulco`,
    title,
    description,
    link: siteUrl,
    feedLinks: {
      rss2: `${siteUrl}/rss.xml`,
    },
    author,
  });

  posts.forEach((post) => {
    const {
      frontmatter: { date, excerpt, title },
      content,
      slug,
    } = post;

    const url = `${siteUrl}/posts/${slug}`;

    feed.addItem({
      title,
      id: url,
      link: url,
      description: excerpt,
      content,
      author: [author],
      date: new Date(date),
    });
  });

  newsletters.forEach((newsletter) => {
    const {
      frontmatter: { date, excerpt, title },
      content,
      slug,
    } = newsletter;

    const url = `${siteUrl}/newsletter/${slug}`;

    feed.addItem({
      title,
      id: url,
      link: url,
      description: excerpt,
      content,
      author: [author],
      date: new Date(date),
    });
  });

  // this will be mikebifulco.com/rss.xml
  fs.writeFileSync('public/rss.xml', feed.rss2());
};
