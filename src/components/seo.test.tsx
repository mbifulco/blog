import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import SEO from './seo';

vi.mock('next/router', () => ({
  useRouter: () => ({ asPath: '/posts/test-post' }),
}));

vi.mock('../utils/images', () => ({
  getCloudinaryImageUrl: (id: string) => `https://cdn.example.com/${id}`,
}));

// next/head renders children into a wrapper so they appear in the jsdom container
vi.mock('next/head', () => ({
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('SEO', () => {
  describe('standard.site document link', () => {
    it('renders site.standard.document link tag when URI is provided', () => {
      const uri =
        'at://did:plc:icpcpp5txyow3prnfgi533lj/site.standard.document/abc123';
      const { container } = render(
        <SEO title="Test Post" standardSiteDocumentUri={uri} />
      );

      const link = container.querySelector(
        'link[rel="site.standard.document"]'
      );
      // jsdom may strip link elements from body — query document as fallback
      const docLink = document.querySelector(
        'link[rel="site.standard.document"]'
      );
      const found = link ?? docLink;
      expect(found).not.toBeNull();
      expect(found).toHaveAttribute('href', uri);
    });

    it('does not render site.standard.document link when URI is not provided', () => {
      const { container } = render(<SEO title="Test Post" />);

      const link =
        container.querySelector('link[rel="site.standard.document"]') ??
        document.querySelector('link[rel="site.standard.document"]');
      expect(link).toBeNull();
    });

    it('does not render site.standard.document link when URI is undefined', () => {
      const { container } = render(
        <SEO title="Test Post" standardSiteDocumentUri={undefined} />
      );

      const link =
        container.querySelector('link[rel="site.standard.document"]') ??
        document.querySelector('link[rel="site.standard.document"]');
      expect(link).toBeNull();
    });
  });

  describe('standard.site publication link', () => {
    it('renders site.standard.publication link tag when URI is provided', () => {
      const uri =
        'at://did:plc:icpcpp5txyow3prnfgi533lj/site.standard.publication/3mmx3e2b57l2m';
      const { container } = render(
        <SEO title="Test Post" standardSitePublicationUri={uri} />
      );

      const link = container.querySelector(
        'link[rel="site.standard.publication"]'
      );
      const docLink = document.querySelector(
        'link[rel="site.standard.publication"]'
      );
      const found = link ?? docLink;
      expect(found).not.toBeNull();
      expect(found).toHaveAttribute('href', uri);
    });

    it('does not render site.standard.publication link when URI is not provided', () => {
      const { container } = render(<SEO title="Test Post" />);

      const link =
        container.querySelector('link[rel="site.standard.publication"]') ??
        document.querySelector('link[rel="site.standard.publication"]');
      expect(link).toBeNull();
    });

    it('does not render site.standard.publication link when URI is undefined', () => {
      const { container } = render(
        <SEO title="Test Post" standardSitePublicationUri={undefined} />
      );

      const link =
        container.querySelector('link[rel="site.standard.publication"]') ??
        document.querySelector('link[rel="site.standard.publication"]');
      expect(link).toBeNull();
    });
  });
});
