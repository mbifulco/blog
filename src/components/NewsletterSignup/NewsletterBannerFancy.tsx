import config from '../../config';
import { Heading } from '../Heading';
import { Headshot } from '../Headshot';
import SponsorCTA from '../SponsorCTA/SponsorCTA';
import { SubscriptionForm } from '../SubscriptionForm';
import SubscriberCount from './SubscriberCount';

const NewsletterSignup: React.FC = () => {
  return (
    <div className="mb-4 flex flex-row text-justify">
      <div className="mx-auto my-0 flex max-w-[800px] flex-col justify-center border border-solid border-gray-200 bg-white px-8 py-4">
        <section className="mx-0 mt-8 mb-0 flex max-w-[calc(100vw_-_2rem)] flex-col gap-2">
          <div className="mb-2 flex flex-row justify-center">
            <Headshot />
          </div>
          <Heading as="h2" className="text-2xl text-black">
            💌 Tiny Improvements Newsletter
          </Heading>
          <p className="font-futura font-bold uppercase">
            Subscribe and join{' '}
            <span className="text-pink-600">
              🔥 <SubscriberCount />{' '}
            </span>{' '}
            other builders
          </p>

          <p>{config.newsletter.shortDescription}</p>
          <SubscriptionForm source="newsletter-banner-fancy" />
          <p className="text-sm text-gray-600">
            Once a week, straight from me to you.{' '}
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
