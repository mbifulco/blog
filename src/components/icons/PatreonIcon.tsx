import clsxm from '@utils/clsxm';
import type { Icon } from '.';

const PatreonIcon: Icon = ({ className }) => (
  <svg
    fill="currentColor"
    preserveAspectRatio="xMidYMid meet"
    viewBox="0 0 436 476"
    style={{ verticalAlign: 'middle' }}
    className={clsxm('h-4 w-4', className)}
  >
    <title>Patreon logo</title>
    <path
      data-fill="1"
      d="M436 143c-.084-60.778-47.57-110.591-103.285-128.565C263.528-7.884 172.279-4.649 106.214 26.424 26.142 64.089.988 146.596.051 228.883c-.77 67.653 6.004 245.841 106.83 247.11 74.917.948 86.072-95.279 120.737-141.623 24.662-32.972 56.417-42.285 95.507-51.929C390.309 265.865 436.097 213.011 436 143Z"
    ></path>
  </svg>
);

export default PatreonIcon;
