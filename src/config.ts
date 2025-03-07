import { ContentTypes } from '@data/content-types';

export const BASE_SITE_URL = 'https://mikebifulco.com';

const config = {
  employer: {
    name: 'Craftwork',
    role: 'co-founder & CTO',
    url: 'https://craftwork.com',
  },
  title: `Mike Bifulco`,
  author: {
    name: `Mike Bifulco @irreverentmike`,
    summary: `| Designer, developer advocate, maker, podcaster.`,
    email: 'hello@mikebifulco.com',
    link: 'https://twitter.com/irreverentmike',
  },
  social: {
    twitter: `@irreverentmike`,
    instagram: `irreverentmike`,
    tiktok: `irreverentmike`,
    github: `mbifulco`,
  },
  newsletter: {
    title: '💌 Tiny Improvements',
    tagline: 'Ship products that matter',
    ctaTagline: '💌 Learn how to build products that change the world',
    shortDescription:
      "My weekly newsletter for product builders. It's a single, tiny idea to help you build better products.",
    description: `
    Tiny Improvements is a newsletter for people designing and building great products.

    I'll share my experience building products as a serial entrepreneur, UX Designer, and front-end developer. I write about tips, tools, and techniques for creating engaging experiences, building great customer relationships, and finding the right audience.

    I also share technical tutorials on a broad range of topics, including:

    - Design for developers
    - React, Next.js, Gatsby, Remix, Markdown, Markdoc, and MDX
    - CSS-in-JS, Styled Components, Tailwind CSS, and Chakra UI
    - GraphQL, Apollo, and Prisma
    - Jamstack, Serverless, and Static Site Generators
    - Firebase, Supabase, SQL, and other database technologies
    - Web Components, WebAssembly, and Web APIs
    - Accessibility, Inclusive Design, and User Experience
    - Product Management, Customer Development, and Lean Startup
    - Remote Work, Remote Teams, and Remote Leadership
    - Personal Development, Self-Improvement, and Personal Growth

    Tiny Improvements is written by Mike Bifulco. Mike was the founder of Smpl (acquired 2020), a coworking management application, a co-founder of APIs You Won’t Hate, the largest community of API developers on the web, and has held engineering leadership roles at Stripe, Google, and Microsoft. He is currently a Developer Advocate, helping developers build great products. Find more of Mike's writing at mikebifulco.com.
    `,
  },
  podcast: {
    description:
      'Bite sized product advice for founders, indiehackers, and makers from Mike Bifulco, CTO and Cofounder of Craftwork',
  },
  description: `Resources for modern software designers and developers.  Tips and walkthroughs on using developer tools like React, node, and javascript.`,
  image_url: `${BASE_SITE_URL}/icons/icon-512x512.png`, // used for RSS feed image
  logoText: 'Mike Bifulco',
  defaultTheme: 'light',
  siteUrl: BASE_SITE_URL,
};

export const ContentDefinitions = {
  [ContentTypes.Post]: {
    directory: 'src/data/posts',
    contentType: ContentTypes.Post,
    path: 'post',
    description: 'Blog posts about design, development, and other topics',
  },
  [ContentTypes.Newsletter]: {
    directory: 'src/data/newsletters',
    contentType: ContentTypes.Newsletter,
    path: 'newsletter',
    description:
      'Weekly newsletter about design, development, and other topics',
  },
  [ContentTypes.Article]: {
    directory: 'src/data/external-references',
    contentType: ContentTypes.Article,
    path: 'article',
    description:
      'External reference articles about design, development, and other topics',
  },
};

export default config;
