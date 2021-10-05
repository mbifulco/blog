import { rules } from 'eslint-config-prettier';
import { Feed } from 'feed';
import moment from 'moment';
import fs from 'fs'

import config from '../config';

export const generateRSSFeed = (posts) => {
  if (process.env.NODE_ENV === 'development') {
    return;
  }
  
  const { author, description, siteUrl, title } = config;

  const feed = new Feed({
    title,
    description,
    baseUrl: siteUrl,
    link: siteUrl,
    feedLinks: {
      rss2: `${siteUrl}/rss.xml`,
    },
    author,
  });

  posts.forEach((post) => {
    const {
      frontmatter: {
        date,
        excerpt,
        path,
        title,
      },
      content,
    } = post;

    const url = `${siteUrl}/posts/${path}`;

    feed.addItem({
      title,
      id: url,
      link: url,
      description: excerpt,
      content,
      author: [author],
      date: new Date(date),
    });

    // this will be mikebifulco.com/rss.xml
    fs.writeFileSync('public/rss.xml', feed.rss2());
  });
};
