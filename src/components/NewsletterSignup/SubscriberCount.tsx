import useNewsletterStats from '@hooks/useNewsletterStats';
import NumberFlow from '@number-flow/react';

const SubscriberCount: React.FC = () => {
  const { subscriberCount } = useNewsletterStats();
  return <NumberFlow value={subscriberCount} />;
};

export default SubscriberCount;
