import type { NextPage } from 'next';

import { Colophon } from '@components/Colophon';
import { Heading } from '@components/Heading';
import { Image } from '@components/Image';
import TableOfContents from '@components/Post/TableOfContents';
import SEO from '@components/seo';
import SponsorCTA from '@components/SponsorCTA/SponsorCTA';

const Shop: NextPage = () => (
  <>
    <SEO
      title="Editorial Integrity, Paid Reviews, and Sponsorship policy"
      description="My policy on editorial integrity, paid reviews, and sponsorships."
    />
    <main className="mx-auto w-fit">
      <div className="mx-auto flex flex-col-reverse content-center justify-center gap-4 md:flex md:flex-row lg:gap-8">
        <article className="prose prose-xl max-w-prose p-5">
          <Heading as="h1" className="justify-center">
            Editorial Integrity, Paid Reviews, and Sponsorships
          </Heading>

          <Image
            publicId="mike/mike-talking"
            alt="Giving a conference talk at Fintech Devcon"
            caption="My reputation is important to me, and I take great care to ensure that sponsorships and reviews are honest and transparent."
          />
          <article className={'prose prose-xl p-2'}>
            <Heading as="h2" id="principles">
              Sponsorship Principles
            </Heading>
            <p>
              This site is representative of my personal brand and values, and I
              take pride in maintaining the trust and respect of my audience. As
              such, I am committed to maintaining trust and transparency in all
              my interactions with my audience - especially when reviewing
              products or services.
            </p>

            <p>
              To ensure that my reviews &amp; sponsorships are fair, unbiased,
              and trustworthy, I have established the following guidelines and
              principles that I adhere to when reviewing products or services:
            </p>
            <Heading as="h3" id="honesty-first">
              Honesty First
            </Heading>
            <p>
              I will always provide an honest and unbiased opinion of the
              product, regardless of any compensation or incentives offered.
            </p>

            <Heading as="h3" id="transparency">
              Transparency
            </Heading>
            <p>
              I will clearly disclose any relationships, sponsorships, or
              compensation received for content shared on any of my accounts.
            </p>

            <Heading as="h3" id="relevance">
              Relevance
            </Heading>
            <p>
              I will only review products that are relevant to my audience and
              align with the themes and topics I regularly cover.
            </p>

            <Heading as="h3" id="full-usage">
              Full Usage
            </Heading>
            <p>
              I will thoroughly test and use the product before writing a review
              to ensure my opinions are well-informed and based on actual
              experience.
            </p>

            <Heading as="h3" id="no-pre-written-reviews">
              No Pre-Written Reviews
            </Heading>
            <p>
              I will not accept or publish pre-written reviews or content
              provided by the product company.
            </p>

            <Heading as="h3" id="editorial-independence">
              Editorial Independence
            </Heading>
            <p>
              I retain full control over the content and timing of my reviews,
              and I will not be influenced by external pressures or requests.
              Reviews will not be shared with the sponsors for approval before
              publication.
            </p>

            <Heading as="h3" id="constructive-feedback">
              Constructive Feedback
            </Heading>
            <p>
              I will aim to provide constructive feedback that can help both my
              audience and the product company improve their offerings.
            </p>

            <Heading as="h3" id="audience-trust">
              Audience Trust
            </Heading>
            <p>
              My primary commitment is to my audience, and I will prioritize
              their trust and best interests in all my reviews.
            </p>

            <Heading as="h2" id="sponsorships">
              Let's work together
            </Heading>
            <p>
              If you made it this far, and our values align, I&apos;d love to
              work with you.
            </p>
            <SponsorCTA />
          </article>
        </article>

        <div className="sticky top-12 flex h-max w-[300px] flex-col gap-4">
          <TableOfContents
            title="Principles"
            headings={[
              { text: 'Sponsorship Principles', level: 2, slug: 'principles' },
              { text: 'Honesty First', level: 3, slug: 'honesty-first' },
              { text: 'Transparency', level: 3, slug: 'transparency' },
              { text: 'Relevance', level: 3, slug: 'relevance' },
              { text: 'Full Usage', level: 3, slug: 'full-usage' },
              {
                text: 'No Pre-Written Reviews',
                level: 3,
                slug: 'no-pre-written-reviews',
              },
              {
                text: 'Editorial Independence',
                level: 3,
                slug: 'editorial-independence',
              },
              {
                text: 'Constructive Feedback',
                level: 3,
                slug: 'constructive-feedback',
              },
              { text: 'Audience Trust', level: 3, slug: 'audience-trust' },
              {
                text: "Sponsorship: Let's work together",
                level: 2,
                slug: 'sponsorships',
              },
            ]}
          />
        </div>
      </div>
    </main>
    <section className="prose prose-xl mx-auto mb-20 w-fit p-5 text-xl">
      <Colophon />
    </section>
  </>
);

export default Shop;
