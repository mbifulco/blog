import { Heading } from '@components/Heading';
import NewsletterItem from '@components/NewsletterFeed/NewsletterItem';
import NewsletterSignup from '@components/NewsletterSignup';
import SubscriberCount from '@components/NewsletterSignup/SubscriberCount';
import SEO from '@components/seo';
import SponsorCTA from '@components/SponsorCTA/SponsorCTA';
import { SubscriptionForm } from '@components/SubscriptionForm';
import { Subtitle } from '@components/Subtitle';
import PaginationWrapper from '../../../components/Pagination';
import config from '../../../config';
import type { Newsletter } from '../../../data/content-types';
import { getPaginatedNewsletters } from '../../../lib/newsletters';
import { generatePaginatedPaths, handlePaginatedStaticProps } from '../../../utils/pagination';

// We use fallback: 'blocking' so that getStaticProps runs for any page param, allowing us to handle invalid page numbers (non-numeric, out-of-range, etc.) with redirects or 404s, while still statically generating valid pages after the first request.
export async function getStaticPaths() {
  const getTotalPages = async (limit: number) => {
    const { totalPages } = await getPaginatedNewsletters({ limit });
    return { totalPages };
  };
  const paths = await generatePaginatedPaths(getTotalPages, 12);
  return { paths, fallback: 'blocking' };
}

export async function getStaticProps({ params }: { params: { page: string } }) {
  const getTotalPages = async (limit: number) => {
    const { totalPages } = await getPaginatedNewsletters({ limit });
    return { totalPages };
  };
  return handlePaginatedStaticProps<{
    newsletters: Newsletter[];
    pagination: {
      currentPage: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  }>({
    params,
    getTotalPages,
    limit: 12,
    redirectBase: '/newsletter',
    getPageProps: async (page) => {
      const paginatedNewsletters = await getPaginatedNewsletters({ page, limit: 12 });
      return {
        props: {
          newsletters: paginatedNewsletters.items,
          pagination: {
            currentPage: paginatedNewsletters.currentPage,
            totalPages: paginatedNewsletters.totalPages,
            hasNextPage: paginatedNewsletters.hasNextPage,
            hasPreviousPage: paginatedNewsletters.hasPreviousPage,
          },
        },
      };
    },
  });
}

type NewsletterPageProps = {
  newsletters: Newsletter[];
  pagination: {
    currentPage: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
};

const NewsletterPage: React.FC<NewsletterPageProps> = ({
  newsletters,
  pagination,
}) => {
  const [latestNewsletter, ...pastNewsletters] = newsletters;

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-4">
      <SEO
        title="💌 Tiny Improvements: a newsletter for startup founders, indiehackers, and product builders"
        description={config.newsletter.shortDescription}
        image={
          'https://res.cloudinary.com/mikebifulco-com/image/upload/v1662476730/newsletters/cover.png'
        }
      />

      <div className="flex flex-col gap-4">
        <header>
          <Heading as="h1">
            <span role="img" aria-label="heart envelope emoji">
              💌
            </span>{' '}
            Tiny Improvements
          </Heading>
          <Subtitle>{config.newsletter.tagline}</Subtitle>
        </header>
        <p className="text-xl">{config.newsletter.shortDescription}</p>
        <p className="text-xl">
          Join{' '}
          <span style={{ fontWeight: 'bold' }}>
            <SubscriberCount /> other product builders
          </span>{' '}
          and get it delivered straight to your inbox by filling out this happy
          lil&apos; form:
        </p>
      </div>
      <div className="mx-auto flex max-w-2xl flex-col gap-2">
        <SubscriptionForm />
        <SponsorCTA />
      </div>

      {pagination.currentPage === 1 && (
        <>
          <Heading
            as="h2"
            className="mt-10 mb-4 text-xl text-black"
            id="latest"
          >
            💌 Read the latest dispatch
          </Heading>
          <NewsletterItem newsletter={latestNewsletter} />
        </>
      )}

      <Heading as="h2" className="mt-4 mb-4 text-xl text-black" id="past">
        Read past dispatches
      </Heading>
      <div className="grid-cols-auto-fit-min-300 grid gap-5">
        {(pagination.currentPage === 1 ? pastNewsletters : newsletters).map(
          (newsletter) => {
            if (!newsletter || !newsletter.frontmatter) return null;
            const { slug } = newsletter.frontmatter;
            return <NewsletterItem newsletter={newsletter} key={slug} />;
          }
        )}
      </div>

      <PaginationWrapper
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        hasNextPage={pagination.hasNextPage}
        hasPreviousPage={pagination.hasPreviousPage}
        basePath="/newsletter"
      />

      <NewsletterSignup />
    </div>
  );
};

export default NewsletterPage;
