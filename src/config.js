const BASE_SITE_URL = 'https://mikebifulco.com';

export default {
  title: `Mike Bifulco - designer, developer, podcaster, maker`,
  author: {
    name: `Mike Bifulco @irreverentmike`,
    summary: `| Designer, developer advocate, maker, podcaster.`,
  },
  social: {
    twitter: `irreverentmike`,
    instagram: `irreverentmike`,
    tiktok: `irreverentmike`,
    github: `mbifulco`,
  },
  // eslint-disable-next-line max-len
  description: `Resources for modern software designers and developers.  Tips and walkthroughs on using developer tools like React, node, and javascript.  Design thoughts and theory, and tips for tools like sketchapp and figma.`,
  logo: {
    src: '',
    alt: '',
  },
  image_url: `${BASE_SITE_URL}/icons/icon-512x512.png`, // used for RSS feed image
  logoText: 'Mike Bifulco',
  defaultTheme: 'light',
  postsPerPage: 5,
  showMenuItems: 2,
  menuMoreText: 'Show more',
  mainMenu: [
    {
      title: 'About',
      path: '/about',
    },
  ],
  siteUrl: BASE_SITE_URL,
};