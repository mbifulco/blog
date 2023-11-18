import { Headshot } from '../Headshot';
import { SubscriptionForm } from '../SubscriptionForm';
import SponsorCTA from '../SponsorCTA/SponsorCTA';
import useConvertKitStats from '../../hooks/useConvertKitStats';
import config from '../../config';
import { Heading } from '../Heading';

type NewsletterSignupProps = {
  tags?: string[];
};

const NewsletterSignup: React.FC<NewsletterSignupProps> = ({ tags }) => {
  const { stats } = useConvertKitStats();
  return (
    <div className="flex flex-row justify-center mb-4">
      <div className="flex flex-col border border-solid border-gray-200 bg-white max-w-lg py-4 px-8 my-0 mx-auto justify-center">
        <section className="flex flex-col gap-4 mt-8 mx-0 mb-0 max-w-[calc(100vw_-_2rem)]">
          <div className="flex flex-row justify-center mb-2">
            <Headshot />
          </div>
          <Heading as="h2" className="text-2xl mb-4 text-black">
            Subscribe to Tiny Improvements
            {stats &&
              `, along with ${stats?.subscriberCount ?? ''} other builders`}
          </Heading>

          <p>{config.newsletter.shortDescription}</p>
          <SubscriptionForm tags={tags} />
          <p className="mb-2 text-gray-600 text-sm">
            Typically once a week, straight from me to you.{' '}
            <span role="img" aria-label="kissy face">
              😘
            </span>{' '}
            Unsubscribe anytime.
          </p>
          <br />
          <SponsorCTA />
        </section>
      </div>
    </div>
  );
};

export default NewsletterSignup;
