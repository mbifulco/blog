import config, { BASE_SITE_URL } from '@/config';
import type { StructuredDataWithType } from './generateStructuredData';

export const personStructuredData: StructuredDataWithType = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: config.author.name.replace(' @irreverentmike', ''),
  brand: [
    {
      '@type': 'Brand',
      name: config.newsletter.title.replace('💌 ', ''),
      url: `${BASE_SITE_URL}/newsletter`,
    },
    {
      '@type': 'Organization',
      name: config.employer.name,
      url: config.employer.url,
    },
    {
      '@type': 'Organization',
      name: "APIs You Won't Hate",
      url: 'https://apisyouwonthate.com',
    },
  ],
  url: BASE_SITE_URL,
  image: `${BASE_SITE_URL}/images/avatar.jpg`,
  sameAs: [
    `https://twitter.com/${config.social.twitter}`,
    `https://github.com/${config.social.github}`,
    'https://www.linkedin.com/in/mbifulco',
    'https://www.youtube.com/@mikebifulco',
    'https://apisyouwonthate.com',
  ],
  jobTitle: config.employer.role,
  worksFor: {
    '@type': 'Organization',
    name: config.employer.name,
    url: 'https://craftwork.paint',
  },
  alumniOf: [
    {
      '@type': 'EducationalOrganization',
      name: 'University of Connecticut',
      url: 'https://www.uconn.edu',
    },
    {
      '@type': 'EducationalOrganization',
      name: 'DePaul University',
      url: 'https://www.depaul.edu',
    },
    {
      '@type': 'EducationalOrganization',
      name: 'Y Combinator',
      url: 'https://www.ycombinator.com',
      description:
        'Startup accelerator. Mike Bifulco was part of the Summer 2023 batch.',
    },
  ],
  knowsAbout: [
    'Software Engineering',
    'Product Design',
    'User Experience',
    'APIs',
    'Startups',
  ],
  description:
    "Mike Bifulco is a software developer, UX designer, and startup founder. He's the CTO and cofounder of Craftwork, and co-runs the developer community 'APIs You Won't Hate.'",
};
