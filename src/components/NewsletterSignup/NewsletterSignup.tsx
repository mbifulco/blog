import config from '../../config';
import useConvertKitStats from '../../hooks/useConvertKitStats';
import { Heading } from '../Heading';
import { Headshot } from '../Headshot';
import SponsorCTA from '../SponsorCTA/SponsorCTA';
import { SubscriptionForm } from '../SubscriptionForm';

type NewsletterSignupProps = {
  tags?: string[];
};

const NewsletterSignup: React.FC<NewsletterSignupProps> = ({ tags }) => {
  const { stats } = useConvertKitStats();
  return (
    <div className="mb-4 flex flex-row justify-center">
      <div className="mx-auto my-0 flex max-w-[800px] flex-col justify-center border border-solid border-gray-200 bg-white px-8 py-4">
        <section className="mx-0 mb-0 mt-8 flex max-w-[calc(100vw_-_2rem)] flex-col gap-4">
          <div className="mb-2 flex flex-row justify-center">
            <Headshot />
          </div>
          <p>Subscribe and join {stats?.subscriberCount} other builders</p>
          <Heading as="h2" className="mb-4 text-2xl text-black">
            💌 Tiny Improvements Newsletter
          </Heading>

          <p>{config.newsletter.shortDescription}</p>
          <SubscriptionForm tags={tags} />
          <p className="mb-2 text-sm text-gray-600">
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
