import NumberFlow from '@number-flow/react';

import useNewsletterStats from '@hooks/useNewsletterStats';

type SubscriberCountProps = {
  label?: string;
};

const SubscriberCount: React.FC<SubscriberCountProps> = ({ label }) => {
  const { subscriberCount } = useNewsletterStats();
  return (
    <NumberFlow
      value={subscriberCount}
      suffix={label}
      format={{
        notation: 'standard', // set to 'compact' for "1.1K" style
        useGrouping: false, // don't display commas
      }}
      className="tabular-nums"
    />
  );
};

export default SubscriberCount;
