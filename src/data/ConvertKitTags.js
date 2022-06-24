const tags = [
  {
    name: 'react',
    id: '3175424',
    label: 'about React.js',
  },
  {
    name: 'remix',
    id: '3175426',
    label: 'about Remix.run',
  },
  {
    name: 'nextjs',
    id: '3175427',
    label: 'about Next.js',
  },
  {
    name: 'founders',
    id: '3175429',
    label: 'for startup founders',
  },
  {
    name: 'creators',
    id: '3175431',
    lavel: 'for creators',
  },
  {
    name: 'developer',
    id: '1456077',
    label: 'for developers',
  },
  {
    name: 'gatsby',
    id: '1456078',
    label: 'about Gatsby',
  },
  {
    name: 'css',
    id: '1456082',
    label: 'about CSS',
  },
  {
    name: 'ux',
    id: '1456087',
    label: 'about User Experience (UX)',
  },
  {
    name: 'designer',
    id: '1456088',
    label: 'for designers',
  },
  {
    name: 'productivity',
    id: '1456091',
    label: 'about productivity',
  },
  {
    name: 'tools',
    id: '1456093',
    label: 'about tools I use',
  },
  {
    name: 'cycling',
    id: '1456097',
    label: 'about cycling',
  },
  {
    name: 'javascript',
    id: '1456096',
    label: 'for JavaScript developers',
  },
  {
    name: 'mental health',
    id: '1456098',
    label: 'mental health and mindfulness',
  },
];

export const getTagInformation = (tag) => tags.find((t) => t.name === tag);

export default tags;
