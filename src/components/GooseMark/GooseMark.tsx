import clsxm from '@utils/clsxm';

const TILE_PADDING = 2;

// Fixed rather than themed: the light-mode blue keeps the white goose legible
// on the tile in dark mode, and orange is what makes it read as a goose.
const TILE_BLUE = '#2340b0';
const GOOSE_ORANGE = '#ff7a1a';

// Pixel grids carry one pixel all round for the outline. "stand"/"step" are the
// upright honk; "charge"/"chargeStep" are the neck-out hiss. Each "step" frame
// dips the head a pixel so a walk cycle bobs.
const FRAMES = {
  stand: {
    width: 38,
    height: 31,
    body: 'M5 3h5v1h-5z M4 4h3v1h-3z M8 4h3v1h-3z M4 5h8v1h-8z M4 6h8v1h-8z M7 7h4v1h-4z M8 8h4v1h-4z M9 9h3v1h-3z M9 10h4v1h-4z M10 11h3v1h-3z M10 12h3v1h-3z M10 13h4v1h-4z M10 14h4v1h-4z M33 14h3v1h-3z M10 15h5v1h-5z M30 15h6v1h-6z M9 16h26v1h-26z M8 17h27v1h-27z M8 18h22v1h-22z M32 18h2v1h-2z M8 19h10v1h-10z M31 19h3v1h-3z M8 20h25v1h-25z M9 21h23v1h-23z M10 22h21v1h-21z M12 23h17v1h-17z M15 24h11v1h-11z',
    beakAndFeet:
      'M1 4h3v1h-3z M1 6h3v1h-3z M17 25h1v1h-1z M23 25h1v1h-1z M17 26h1v1h-1z M23 26h1v1h-1z M17 27h1v1h-1z M23 27h1v1h-1z M17 28h1v1h-1z M23 28h1v1h-1z M14 29h5v1h-5z M20 29h5v1h-5z',
    ink: 'M7 4h1v1h-1z M30 18h2v1h-2z M18 19h13v1h-13z',
    outline:
      'M5 2h5v1h-5z M4 3h1v1h-1z M10 3h1v1h-1z M11 4h1v1h-1z M3 5h1v1h-1z M12 5h1v1h-1z M12 6h1v1h-1z M4 7h3v1h-3z M11 7h1v1h-1z M7 8h1v1h-1z M12 8h1v1h-1z M8 9h1v1h-1z M12 9h1v1h-1z M8 10h1v1h-1z M13 10h1v1h-1z M9 11h1v1h-1z M13 11h1v1h-1z M9 12h1v1h-1z M13 12h1v1h-1z M9 13h1v1h-1z M14 13h1v1h-1z M33 13h3v1h-3z M9 14h1v1h-1z M14 14h1v1h-1z M30 14h3v1h-3z M36 14h1v1h-1z M9 15h1v1h-1z M15 15h15v1h-15z M36 15h1v1h-1z M8 16h1v1h-1z M35 16h1v1h-1z M7 17h1v1h-1z M35 17h1v1h-1z M7 18h1v1h-1z M34 18h1v1h-1z M7 19h1v1h-1z M34 19h1v1h-1z M7 20h1v1h-1z M33 20h1v1h-1z M8 21h1v1h-1z M32 21h1v1h-1z M9 22h1v1h-1z M31 22h1v1h-1z M10 23h2v1h-2z M29 23h2v1h-2z M12 24h3v1h-3z M26 24h3v1h-3z M15 25h2v1h-2z M18 25h5v1h-5z M24 25h2v1h-2z',
  },
  step: {
    width: 38,
    height: 31,
    body: 'M5 4h5v1h-5z M4 5h3v1h-3z M8 5h3v1h-3z M4 6h8v1h-8z M4 7h8v1h-8z M7 8h4v1h-4z M8 9h4v1h-4z M9 10h4v1h-4z M9 11h4v1h-4z M10 12h3v1h-3z M10 13h4v1h-4z M10 14h4v1h-4z M33 14h3v1h-3z M10 15h5v1h-5z M30 15h6v1h-6z M9 16h26v1h-26z M8 17h27v1h-27z M8 18h22v1h-22z M32 18h2v1h-2z M8 19h10v1h-10z M31 19h3v1h-3z M8 20h25v1h-25z M9 21h23v1h-23z M10 22h21v1h-21z M12 23h17v1h-17z M15 24h11v1h-11z',
    beakAndFeet:
      'M1 5h3v1h-3z M1 7h3v1h-3z M16 25h1v1h-1z M24 25h1v1h-1z M15 26h1v1h-1z M25 26h1v1h-1z M15 27h1v1h-1z M25 27h1v1h-1z M14 28h1v1h-1z M26 28h1v1h-1z M11 29h5v1h-5z M25 29h5v1h-5z',
    ink: 'M7 5h1v1h-1z M30 18h2v1h-2z M18 19h13v1h-13z',
    outline:
      'M5 3h5v1h-5z M4 4h1v1h-1z M10 4h1v1h-1z M11 5h1v1h-1z M3 6h1v1h-1z M12 6h1v1h-1z M12 7h1v1h-1z M4 8h3v1h-3z M11 8h1v1h-1z M7 9h1v1h-1z M12 9h1v1h-1z M8 10h1v1h-1z M13 10h1v1h-1z M8 11h1v1h-1z M13 11h1v1h-1z M9 12h1v1h-1z M13 12h1v1h-1z M9 13h1v1h-1z M14 13h1v1h-1z M33 13h3v1h-3z M9 14h1v1h-1z M14 14h1v1h-1z M30 14h3v1h-3z M36 14h1v1h-1z M9 15h1v1h-1z M15 15h15v1h-15z M36 15h1v1h-1z M8 16h1v1h-1z M35 16h1v1h-1z M7 17h1v1h-1z M35 17h1v1h-1z M7 18h1v1h-1z M34 18h1v1h-1z M7 19h1v1h-1z M34 19h1v1h-1z M7 20h1v1h-1z M33 20h1v1h-1z M8 21h1v1h-1z M32 21h1v1h-1z M9 22h1v1h-1z M31 22h1v1h-1z M10 23h2v1h-2z M29 23h2v1h-2z M12 24h3v1h-3z M26 24h3v1h-3z M15 25h1v1h-1z M17 25h7v1h-7z M25 25h1v1h-1z',
  },
  charge: {
    width: 42,
    height: 25,
    body: 'M37 2h3v1h-3z M25 3h8v1h-8z M34 3h6v1h-6z M21 4h18v1h-18z M19 5h19v1h-19z M18 6h20v1h-20z M17 7h21v1h-21z M17 8h17v1h-17z M36 8h2v1h-2z M5 9h5v1h-5z M16 9h7v1h-7z M35 9h3v1h-3z M5 10h2v1h-2z M8 10h30v1h-30z M4 11h34v1h-34z M4 12h33v1h-33z M5 13h5v1h-5z M16 13h21v1h-21z M17 14h19v1h-19z M18 15h17v1h-17z M20 16h13v1h-13z M23 17h8v1h-8z',
    beakAndFeet:
      'M1 10h4v1h-4z M1 12h3v1h-3z M25 18h1v1h-1z M31 18h1v1h-1z M25 19h1v1h-1z M31 19h1v1h-1z M25 20h1v1h-1z M31 20h1v1h-1z M25 21h1v1h-1z M31 21h1v1h-1z M22 22h5v1h-5z M28 22h5v1h-5z',
    ink: 'M34 8h2v1h-2z M23 9h12v1h-12z M7 10h1v1h-1z',
    outline:
      'M37 1h3v1h-3z M25 2h8v1h-8z M34 2h3v1h-3z M40 2h1v1h-1z M21 3h4v1h-4z M33 3h1v1h-1z M40 3h1v1h-1z M19 4h2v1h-2z M39 4h1v1h-1z M18 5h1v1h-1z M38 5h1v1h-1z M17 6h1v1h-1z M38 6h1v1h-1z M16 7h1v1h-1z M38 7h1v1h-1z M5 8h5v1h-5z M16 8h1v1h-1z M38 8h1v1h-1z M4 9h1v1h-1z M10 9h6v1h-6z M38 9h1v1h-1z M38 10h1v1h-1z M3 11h1v1h-1z M38 11h1v1h-1z M37 12h1v1h-1z M4 13h1v1h-1z M10 13h6v1h-6z M37 13h1v1h-1z M5 14h5v1h-5z M16 14h1v1h-1z M36 14h1v1h-1z M17 15h1v1h-1z M35 15h1v1h-1z M18 16h2v1h-2z M33 16h2v1h-2z M20 17h3v1h-3z M31 17h2v1h-2z M23 18h2v1h-2z M26 18h5v1h-5z',
  },
  chargeStep: {
    width: 42,
    height: 25,
    body: 'M37 2h3v1h-3z M25 3h8v1h-8z M34 3h6v1h-6z M21 4h18v1h-18z M19 5h19v1h-19z M18 6h20v1h-20z M17 7h21v1h-21z M17 8h17v1h-17z M36 8h2v1h-2z M16 9h7v1h-7z M35 9h3v1h-3z M5 10h5v1h-5z M16 10h22v1h-22z M5 11h2v1h-2z M8 11h30v1h-30z M4 12h33v1h-33z M4 13h33v1h-33z M5 14h5v1h-5z M17 14h19v1h-19z M18 15h17v1h-17z M20 16h13v1h-13z M23 17h8v1h-8z',
    beakAndFeet:
      'M1 11h4v1h-4z M1 13h3v1h-3z M24 18h1v1h-1z M32 18h1v1h-1z M23 19h1v1h-1z M33 19h1v1h-1z M23 20h1v1h-1z M33 20h1v1h-1z M22 21h1v1h-1z M34 21h1v1h-1z M19 22h5v1h-5z M33 22h5v1h-5z',
    ink: 'M34 8h2v1h-2z M23 9h12v1h-12z M7 11h1v1h-1z',
    outline:
      'M37 1h3v1h-3z M25 2h8v1h-8z M34 2h3v1h-3z M40 2h1v1h-1z M21 3h4v1h-4z M33 3h1v1h-1z M40 3h1v1h-1z M19 4h2v1h-2z M39 4h1v1h-1z M18 5h1v1h-1z M38 5h1v1h-1z M17 6h1v1h-1z M38 6h1v1h-1z M16 7h1v1h-1z M38 7h1v1h-1z M16 8h1v1h-1z M38 8h1v1h-1z M5 9h5v1h-5z M15 9h1v1h-1z M38 9h1v1h-1z M4 10h1v1h-1z M10 10h6v1h-6z M38 10h1v1h-1z M38 11h1v1h-1z M3 12h1v1h-1z M37 12h1v1h-1z M37 13h1v1h-1z M4 14h1v1h-1z M10 14h7v1h-7z M36 14h1v1h-1z M5 15h5v1h-5z M17 15h1v1h-1z M35 15h1v1h-1z M18 16h2v1h-2z M33 16h2v1h-2z M20 17h3v1h-3z M31 17h2v1h-2z M23 18h1v1h-1z M25 18h6v1h-6z',
  },
};

export type GooseFrame = keyof typeof FRAMES;

type GooseMarkProps = {
  className?: string;
  title?: string;
  frame?: GooseFrame;
  /** "tile" sits the goose on a blue square; "outline" inks its edge so it reads on any ground. */
  variant?: 'tile' | 'outline';
};

const GooseMark: React.FC<GooseMarkProps> = ({
  className,
  title,
  frame = 'stand',
  variant = 'tile',
}) => {
  const paths = FRAMES[frame];
  const pad = variant === 'tile' ? TILE_PADDING : 0;
  const width = paths.width + pad * 2;
  const height = paths.height + pad * 2;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      shapeRendering="crispEdges"
      className={clsxm('h-auto', className)}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
    >
      {title && <title>{title}</title>}
      {variant === 'tile' && (
        <rect width={width} height={height} fill={TILE_BLUE} />
      )}
      <g transform={`translate(${pad} ${pad})`}>
        {variant === 'outline' && (
          <path className="fill-riso-blue" d={paths.outline} />
        )}
        <path fill="#fff" d={paths.body} />
        <path fill={GOOSE_ORANGE} d={paths.beakAndFeet} />
        <path fill={TILE_BLUE} d={paths.ink} />
      </g>
    </svg>
  );
};

export default GooseMark;
