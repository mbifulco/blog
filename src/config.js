const BASE_SITE_URL = 'https://mikebifulco.com';

const config = {
  title: `Mike Bifulco - designer, developer, podcaster, maker`,
  author: {
    name: `Mike Bifulco @irreverentmike`,
    summary: `| Designer, developer advocate, maker, podcaster.`,
    email: 'hello@mikebifulco.com',
    link: 'https://twitter.com/irreverentmike',
  },
  social: {
    twitter: `irreverentmike`,
    instagram: `irreverentmike`,
    tiktok: `irreverentmike`,
    github: `mbifulco`,
  },
  // eslint-disable-next-line max-len
  description: `Resources for modern software designers and developers.  Tips and walkthroughs on using developer tools like React, node, and javascript.  Design thoughts and theory, and tips for tools like sketchapp and figma.`,
  image_url: `${BASE_SITE_URL}/icons/icon-512x512.png`, // used for RSS feed image
  logoText: 'Mike Bifulco',
  defaultTheme: 'light',
  siteUrl: BASE_SITE_URL,
};

export default config;