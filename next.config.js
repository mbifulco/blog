module.exports = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx'],
  images: {
    domains: ['i.ytimg.com', 'res.cloudinary.com', 'images.unsplash.com'],
  },
  productionBrowserSourceMaps: true,
  compress: false,
  webpack: (config, context) => {
    return {
      ...config,
      optimization: {
        ...config?.optimzation,
        minimize: false,
      },
    };
  },
  redirects: async () => {
    return [
      {
        source: '/meet',
        destination: 'https://savvycal.com/irreverentmike/30m',
        permanent: false,
      },
      {
        source: '/meet/pod',
        destination: 'https://savvycal.com/irreverentmike/pod',
        permanent: false,
      },
      {
        source: '/sponsor',
        destination: 'https://www.passionfroot.xyz/irreverentmike',
        permanent: false,
      },
    ];
  },
};
