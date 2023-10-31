import Image from 'next/image';

const Headshot: React.FC<{
  className?: string;
}> = ({ className }) => (
  <Image
    src="/images/mike-headshot-square.png"
    height={100}
    width={100}
    alt="Mike Bifulco headshot"
    className={`headshot ${className}`}
  />
);

export default Headshot;
