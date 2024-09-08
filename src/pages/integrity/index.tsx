import type { NextPage } from 'next';

import { Heading } from '@/components/Heading';
import SEO from '@/components/seo';

const Shop: NextPage = () => (
  <>
    <SEO
      title="Editorial Integrity, Paid Reviews, and Sponsorship policy"
      description="My policy on editorial integrity, paid reviews, and sponsorships."
    />
    <main className={'mx-auto mb-5 w-full max-w-3xl p-5 text-left'}>
      <Heading as="h1" className="justify-center">
        Editorial Integrity, Paid Reviews, and Sponsorships
      </Heading>

      <article className={'prose prose-xl p-2'}>
        <p>
          This site is representative of my personal brand and values, and I
          take pride in maintaining the trust and respect of my audience. As
          such, I am committed to maintaining trust and transparency in all my
          interactions with my audience - especially when reviewing products or
          services.
        </p>

        <p>
          To ensure that my reviews &amp; sponsorships are fair, unbiased, and
          trustworthy, I have established the following guidelines and
          principles that I adhere to when reviewing products or services:
        </p>
        <Heading as="h3">Honesty First</Heading>
        <p>
          I will always provide an honest and unbiased opinion of the product,
          regardless of any compensation or incentives offered.
        </p>

        <Heading as="h3">Transparency</Heading>
        <p>
          I will clearly disclose any relationships, sponsorships, or
          compensation received for content shared on any of my accounts.
        </p>

        <Heading as="h3">Relevance</Heading>
        <p>
          I will only review products that are relevant to my audience and align
          with the themes and topics I regularly cover.
        </p>

        <Heading as="h3">Full Usage</Heading>
        <p>
          I will thoroughly test and use the product before writing a review to
          ensure my opinions are well-informed and based on actual experience.
        </p>

        <Heading as="h3">No Pre-Written Reviews</Heading>
        <p>
          I will not accept or publish pre-written reviews or content provided
          by the product company.
        </p>

        <Heading as="h3">Editorial Independence</Heading>
        <p>
          I retain full control over the content and timing of my reviews, and I
          will not be influenced by external pressures or requests. Reviews will
          not be shared with the sponsors for approval before publication.
        </p>

        <Heading as="h3">Constructive Feedback</Heading>
        <p>
          I will aim to provide constructive feedback that can help both my
          audience and the product company improve their offerings.
        </p>

        <Heading as="h3">Audience Trust</Heading>
        <p>
          My primary commitment is to my audience, and I will prioritize their
          trust and best interests in all my reviews.
        </p>
      </article>
    </main>
  </>
);

export default Shop;
