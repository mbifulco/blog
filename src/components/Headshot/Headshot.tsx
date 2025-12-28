import Image from 'next/image';

import clsxm from '@utils/clsxm';

const Headshot: React.FC<{
  className?: string;
  priority?: boolean;
  size?: number;
}> = ({ size = 100, className, priority = false }) => (
  <Image
    src="/images/mike-headshot-square.png"
    height={size}
    width={size}
    alt="Mike Bifulco headshot"
    className={clsxm(`headshot ${className}`)}
    priority={priority}
    quality={90}
  />
);

export default Headshot;
