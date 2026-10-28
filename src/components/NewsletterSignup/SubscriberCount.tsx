import useNewsletterStats from '@hooks/useNewsletterStats';
import NumberFlow from '@number-flow/react';

type SubscriberCountProps = {
  label?: string;
};

const SubscriberCount: React.FC<SubscriberCountProps> = ({ label }) => {
  const { subscriberCount, isCountLoaded } = useNewsletterStats();
  return (
    <NumberFlow
      value={subscriberCount}
      suffix={isCountLoaded ? label : `+${label ?? ''}`}
      format={{
        notation: 'standard', // set to 'compact' for "1.1K" style
      }}
      className="tabular-nums"
    />
  );
};

export default SubscriberCount;
