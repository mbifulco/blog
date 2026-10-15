import { useId } from 'react';

import clsxm from '@utils/clsxm';

// Fixed rather than themed, matching GooseMark: white body, orange bill.
const GOOSE_ORANGE = '#ff7a1a';

// A pixel neck and honking head with a halftone burst off its bill, all in
// grid units. The bill has no outline so its open V reads at nav size. The
// bird is clipped 3 rows above the neck's end, so it rises from behind
// whatever rule it sits on and can lift that far without a gap; the burst is
// free to spill past the view box.
export const GOOSE_NECK_BOUNDS = { x: -1, y: -2, width: 26, height: 31 };
const VIEW_BOX = Object.values(GOOSE_NECK_BOUNDS).join(' ');
const VISIBLE_BOTTOM = 29;
export const GOOSE_NECK_PATHS = {
  outline:
    'M10 1h1v1h-1zM11 1h1v1h-1zM12 1h1v1h-1zM13 1h1v1h-1zM8 2h1v1h-1zM9 2h1v1h-1zM14 2h1v1h-1zM7 3h1v1h-1zM6 4h1v1h-1zM6 5h1v1h-1zM6 6h1v1h-1zM15 6h1v1h-1zM6 7h1v1h-1zM7 8h1v1h-1zM7 9h1v1h-1zM14 9h1v1h-1zM7 10h1v1h-1zM13 10h1v1h-1zM7 11h1v1h-1zM13 11h1v1h-1zM7 12h1v1h-1zM13 12h1v1h-1zM6 13h1v1h-1zM13 13h1v1h-1zM6 14h1v1h-1zM13 14h1v1h-1zM6 15h1v1h-1zM13 15h1v1h-1zM6 16h1v1h-1zM12 16h1v1h-1zM5 17h1v1h-1zM12 17h1v1h-1zM5 18h1v1h-1zM12 18h1v1h-1zM5 19h1v1h-1zM12 19h1v1h-1zM4 20h1v1h-1zM13 20h1v1h-1zM4 21h1v1h-1zM13 21h1v1h-1zM4 22h1v1h-1zM13 22h1v1h-1zM3 23h1v1h-1zM13 23h1v1h-1zM3 24h1v1h-1zM13 24h1v1h-1zM3 25h1v1h-1zM13 25h1v1h-1zM2 26h1v1h-1zM13 26h1v1h-1zM2 27h1v1h-1zM13 27h1v1h-1zM1 28h1v1h-1zM13 28h1v1h-1zM1 29h1v1h-1zM14 29h1v1h-1zM1 30h1v1h-1zM14 30h1v1h-1zM1 31h1v1h-1zM15 31h1v1h-1z',
  body: 'M10 2h4v1h-4zM8 3h3v1h-3zM13 3h2v1h-2zM7 4h6v1h-6zM14 4h1v1h-1zM7 5h5v1h-5zM13 5h2v1h-2zM7 6h8v1h-8zM7 7h8v1h-8zM8 8h7v1h-7zM8 9h6v1h-6zM8 10h5v1h-5zM8 11h5v1h-5zM8 12h5v1h-5zM7 13h6v1h-6zM7 14h6v1h-6zM8 15h5v1h-5zM7 16h5v1h-5zM6 17h6v1h-6zM7 18h5v1h-5zM6 19h6v1h-6zM5 20h1v1h-1zM7 20h6v1h-6zM6 21h7v1h-7zM5 22h1v1h-1zM7 22h6v1h-6zM4 23h1v1h-1zM6 23h7v1h-7zM5 24h8v1h-8zM4 25h1v1h-1zM6 25h7v1h-7zM3 26h1v1h-1zM5 26h8v1h-8zM4 27h9v1h-9zM3 28h1v1h-1zM5 28h8v1h-8zM2 29h1v1h-1zM4 29h10v1h-10zM3 30h1v1h-1zM5 30h9v1h-9zM2 31h1v1h-1zM4 31h11v1h-11z',
  shade:
    'M11 3h2v1h-2zM13 4h1v1h-1zM12 5h1v1h-1zM7 15h1v1h-1zM6 18h1v1h-1zM6 20h1v1h-1zM5 21h1v1h-1zM6 22h1v1h-1zM5 23h1v1h-1zM4 24h1v1h-1zM5 25h1v1h-1zM4 26h1v1h-1zM3 27h1v1h-1zM2 28h1v1h-1zM4 28h1v1h-1zM3 29h1v1h-1zM2 30h1v1h-1zM4 30h1v1h-1zM3 31h1v1h-1z',
  bill: 'M20 0h2v1h-2zM18 1h4v1h-4zM17 2h4v1h-4zM15 3h5v1h-5zM15 4h4v1h-4zM15 5h2v1h-2zM20 5h2v1h-2zM18 6h4v1h-4zM15 7h5v1h-5zM15 8h2v1h-2z',
  burst:
    'M14.84 -1.47a0.31 0.31 0 1 0 0.62 0a0.31 0.31 0 1 0 -0.62 0M16.39 -1.47a0.46 0.46 0 1 0 0.93 0a0.46 0.46 0 1 0 -0.93 0M18.05 -4.42a0.50 0.50 0 1 0 1.00 0a0.50 0.50 0 1 0 -1.00 0M17.93 -1.47a0.62 0.62 0 1 0 1.24 0a0.62 0.62 0 1 0 -1.24 0M17.14 0.00a0.56 0.56 0 1 0 1.11 0a0.56 0.56 0 1 0 -1.11 0M17.93 1.47a0.62 0.62 0 1 0 1.24 0a0.62 0.62 0 1 0 -1.24 0M17.20 2.94a0.50 0.50 0 1 0 1.00 0a0.50 0.50 0 1 0 -1.00 0M18.24 7.36a0.31 0.31 0 1 0 0.62 0a0.31 0.31 0 1 0 -0.62 0M19.63 -4.42a0.62 0.62 0 1 0 1.24 0a0.62 0.62 0 1 0 -1.24 0M18.76 -2.94a0.64 0.64 0 1 0 1.28 0a0.64 0.64 0 1 0 -1.28 0M19.48 -1.47a0.77 0.77 0 1 0 1.54 0a0.77 0.77 0 1 0 -1.54 0M18.68 0.00a0.72 0.72 0 1 0 1.43 0a0.72 0.72 0 1 0 -1.43 0M19.48 1.47a0.77 0.77 0 1 0 1.54 0a0.77 0.77 0 1 0 -1.54 0M18.76 2.94a0.64 0.64 0 1 0 1.28 0a0.64 0.64 0 1 0 -1.28 0M19.63 4.42a0.62 0.62 0 1 0 1.24 0a0.62 0.62 0 1 0 -1.24 0M18.94 5.89a0.46 0.46 0 1 0 0.93 0a0.46 0.46 0 1 0 -0.93 0M20.79 -8.83a0.31 0.31 0 1 0 0.62 0a0.31 0.31 0 1 0 -0.62 0M21.49 -7.36a0.46 0.46 0 1 0 0.93 0a0.46 0.46 0 1 0 -0.93 0M20.54 -5.89a0.56 0.56 0 1 0 1.11 0a0.56 0.56 0 1 0 -1.11 0M21.23 -4.42a0.72 0.72 0 1 0 1.43 0a0.72 0.72 0 1 0 -1.43 0M20.33 -2.94a0.77 0.77 0 1 0 1.54 0a0.77 0.77 0 1 0 -1.54 0M21.03 -1.47a0.92 0.92 0 1 0 1.83 0a0.92 0.92 0 1 0 -1.83 0M20.23 0.00a0.87 0.87 0 1 0 1.75 0a0.87 0.87 0 1 0 -1.75 0M21.03 1.47a0.92 0.92 0 1 0 1.83 0a0.92 0.92 0 1 0 -1.83 0M20.33 2.94a0.77 0.77 0 1 0 1.54 0a0.77 0.77 0 1 0 -1.54 0M21.23 4.42a0.72 0.72 0 1 0 1.43 0a0.72 0.72 0 1 0 -1.43 0M20.54 5.89a0.56 0.56 0 1 0 1.11 0a0.56 0.56 0 1 0 -1.11 0M22.18 -5.89a0.62 0.62 0 1 0 1.24 0a0.62 0.62 0 1 0 -1.24 0M22.88 -4.42a0.77 0.77 0 1 0 1.54 0a0.77 0.77 0 1 0 -1.54 0M21.93 -2.94a0.87 0.87 0 1 0 1.75 0a0.87 0.87 0 1 0 -1.75 0M22.73 -1.47a0.92 0.92 0 1 0 1.84 0a0.92 0.92 0 1 0 -1.84 0M21.88 0.00a0.92 0.92 0 1 0 1.84 0a0.92 0.92 0 1 0 -1.84 0M22.73 1.47a0.92 0.92 0 1 0 1.84 0a0.92 0.92 0 1 0 -1.84 0M21.93 2.94a0.87 0.87 0 1 0 1.75 0a0.87 0.87 0 1 0 -1.75 0M22.88 4.42a0.77 0.77 0 1 0 1.54 0a0.77 0.77 0 1 0 -1.54 0M22.18 5.89a0.62 0.62 0 1 0 1.24 0a0.62 0.62 0 1 0 -1.24 0M23.15 7.36a0.50 0.50 0 1 0 1.00 0a0.50 0.50 0 1 0 -1.00 0M24.85 -7.36a0.50 0.50 0 1 0 1.00 0a0.50 0.50 0 1 0 -1.00 0M23.86 -5.89a0.64 0.64 0 1 0 1.28 0a0.64 0.64 0 1 0 -1.28 0M24.58 -4.42a0.77 0.77 0 1 0 1.54 0a0.77 0.77 0 1 0 -1.54 0M23.58 -2.94a0.92 0.92 0 1 0 1.83 0a0.92 0.92 0 1 0 -1.83 0M24.43 -1.47a0.92 0.92 0 1 0 1.84 0a0.92 0.92 0 1 0 -1.84 0M23.58 0.00a0.92 0.92 0 1 0 1.84 0a0.92 0.92 0 1 0 -1.84 0M24.43 1.47a0.92 0.92 0 1 0 1.84 0a0.92 0.92 0 1 0 -1.84 0M23.58 2.94a0.92 0.92 0 1 0 1.83 0a0.92 0.92 0 1 0 -1.83 0M24.58 4.42a0.77 0.77 0 1 0 1.54 0a0.77 0.77 0 1 0 -1.54 0M23.86 5.89a0.64 0.64 0 1 0 1.28 0a0.64 0.64 0 1 0 -1.28 0M25.58 -5.89a0.62 0.62 0 1 0 1.24 0a0.62 0.62 0 1 0 -1.24 0M26.33 -4.42a0.72 0.72 0 1 0 1.43 0a0.72 0.72 0 1 0 -1.43 0M25.33 -2.94a0.87 0.87 0 1 0 1.75 0a0.87 0.87 0 1 0 -1.75 0M26.13 -1.47a0.92 0.92 0 1 0 1.83 0a0.92 0.92 0 1 0 -1.83 0M25.28 0.00a0.92 0.92 0 1 0 1.84 0a0.92 0.92 0 1 0 -1.84 0M26.13 1.47a0.92 0.92 0 1 0 1.83 0a0.92 0.92 0 1 0 -1.83 0M25.33 2.94a0.87 0.87 0 1 0 1.75 0a0.87 0.87 0 1 0 -1.75 0M26.33 4.42a0.72 0.72 0 1 0 1.43 0a0.72 0.72 0 1 0 -1.43 0M25.58 5.89a0.62 0.62 0 1 0 1.24 0a0.62 0.62 0 1 0 -1.24 0M26.59 7.36a0.46 0.46 0 1 0 0.93 0a0.46 0.46 0 1 0 -0.93 0M27.34 -5.89a0.56 0.56 0 1 0 1.11 0a0.56 0.56 0 1 0 -1.11 0M28.13 -4.42a0.62 0.62 0 1 0 1.24 0a0.62 0.62 0 1 0 -1.24 0M27.13 -2.94a0.77 0.77 0 1 0 1.54 0a0.77 0.77 0 1 0 -1.54 0M27.98 -1.47a0.77 0.77 0 1 0 1.54 0a0.77 0.77 0 1 0 -1.54 0M27.03 0.00a0.87 0.87 0 1 0 1.75 0a0.87 0.87 0 1 0 -1.75 0M27.98 1.47a0.77 0.77 0 1 0 1.54 0a0.77 0.77 0 1 0 -1.54 0M27.13 2.94a0.77 0.77 0 1 0 1.54 0a0.77 0.77 0 1 0 -1.54 0M28.13 4.42a0.62 0.62 0 1 0 1.24 0a0.62 0.62 0 1 0 -1.24 0M27.34 5.89a0.56 0.56 0 1 0 1.11 0a0.56 0.56 0 1 0 -1.11 0M27.59 8.83a0.31 0.31 0 1 0 0.62 0a0.31 0.31 0 1 0 -0.62 0M30.14 -7.36a0.31 0.31 0 1 0 0.62 0a0.31 0.31 0 1 0 -0.62 0M29.14 -5.89a0.46 0.46 0 1 0 0.93 0a0.46 0.46 0 1 0 -0.93 0M28.96 -2.94a0.64 0.64 0 1 0 1.28 0a0.64 0.64 0 1 0 -1.28 0M29.83 -1.47a0.62 0.62 0 1 0 1.24 0a0.62 0.62 0 1 0 -1.24 0M28.88 0.00a0.72 0.72 0 1 0 1.43 0a0.72 0.72 0 1 0 -1.43 0M29.83 1.47a0.62 0.62 0 1 0 1.24 0a0.62 0.62 0 1 0 -1.24 0M28.96 2.94a0.64 0.64 0 1 0 1.28 0a0.64 0.64 0 1 0 -1.28 0M29.95 4.42a0.50 0.50 0 1 0 1.00 0a0.50 0.50 0 1 0 -1.00 0M30.80 -2.94a0.50 0.50 0 1 0 1.00 0a0.50 0.50 0 1 0 -1.00 0M30.74 0.00a0.56 0.56 0 1 0 1.11 0a0.56 0.56 0 1 0 -1.11 0M31.69 1.47a0.46 0.46 0 1 0 0.93 0a0.46 0.46 0 1 0 -0.93 0M33.54 1.47a0.31 0.31 0 1 0 0.62 0a0.31 0.31 0 1 0 -0.62 0',
};

type GooseNeckProps = {
  className?: string;
};

const GooseNeck: React.FC<GooseNeckProps> = ({ className }) => {
  // useId's colons aren't safe inside url(#...)
  const clipId = `goose-neck-${useId().replace(/[^\w-]/g, '')}`;
  return (
    <svg
      viewBox={VIEW_BOX}
      className={clsxm('h-auto overflow-visible', className)}
      aria-hidden
    >
      <defs>
        {/* Static, so it stays put while the bird inside it moves */}
        <clipPath id={clipId}>
          <rect x={-100} y={-100} width={200} height={100 + VISIBLE_BOTTOM} />
        </clipPath>
      </defs>
      <path
        className="goose-neck-burst fill-riso-pink-bright"
        d={GOOSE_NECK_PATHS.burst}
      />
      <g clipPath={`url(#${clipId})`}>
        <g className="goose-neck-bird" shapeRendering="crispEdges">
          <path className="fill-riso-blue" d={GOOSE_NECK_PATHS.outline} />
          <path fill="#fff" d={GOOSE_NECK_PATHS.body} />
          <path className="fill-riso-blue" d={GOOSE_NECK_PATHS.shade} />
          <path fill={GOOSE_ORANGE} d={GOOSE_NECK_PATHS.bill} />
        </g>
      </g>
    </svg>
  );
};

export default GooseNeck;
