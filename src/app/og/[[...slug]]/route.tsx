import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { OgCard } from '@lib/og-cards';
import { ImageResponse } from 'next/og';

import { GOOSE_NECK_BOUNDS, GOOSE_NECK_PATHS } from '@components/GooseMark';
import { getOgCards } from '@lib/og-cards';

const WIDTH = 1200;
const HEIGHT = 630;
// Satori ignores `right`/`bottom` on absolute boxes and won't size a box from
// both edges, so every block gets an explicit left, top, and width.
const MARGIN = 72;
const CONTENT_WIDTH = WIDTH - MARGIN * 2;
const TITLE_WIDTH = CONTENT_WIDTH - 48;
const STRAP_TOP = 520;
const HOME_GOOSE_HEIGHT = 270;

// Light-mode riso inks from globals.css. Satori can't read CSS variables, so
// these are copied rather than referenced; keep them in sync.
const STOCK = '#f5f7fb';
const TINT_PINK = '#ffe0ef';
const TINT_BLUE = '#dde3f8';
const PINK = '#c21469';
const PINK_BRIGHT = '#ff48b0';
const BLUE = '#2340b0';
const GOOSE_ORANGE = '#ff7a1a';

const dumpling = readFile(join(process.cwd(), 'public/fonts/TAYDumpling.woff'));

/** A 9px-pitch halftone disc, scaled up, like the home masthead's. */
const HalftoneDisc: React.FC<{ size: number; pitch: number }> = ({
  size,
  pitch,
}) => {
  const radius = pitch * 0.27;
  const center = size / 2;
  let d = '';
  for (let y = pitch / 2; y < size; y += pitch) {
    for (let x = pitch / 2; x < size; x += pitch) {
      if (Math.hypot(x - center, y - center) > center - radius) continue;
      d += `M${x - radius} ${y}a${radius} ${radius} 0 1 0 ${radius * 2} 0a${radius} ${radius} 0 1 0 ${-radius * 2} 0`;
    }
  }
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <path d={d} fill={PINK_BRIGHT} fillOpacity={0.6} />
    </svg>
  );
};

// Satori clips SVG content to the view box, so it is widened to hold the
// burst that spills up and right off the bill.
const BURST_ROOM = { right: 11, top: 10 };

/** The nav goose, honking with its burst; `height` is the goose's own height. */
const Goose: React.FC<{ height: number }> = ({ height }) => {
  const { x, y, width, height: boxHeight } = GOOSE_NECK_BOUNDS;
  const scale = height / boxHeight;
  const viewWidth = width + BURST_ROOM.right;
  const viewHeight = boxHeight + BURST_ROOM.top;
  return (
    <svg
      width={viewWidth * scale}
      height={viewHeight * scale}
      viewBox={`${x} ${y - BURST_ROOM.top} ${viewWidth} ${viewHeight}`}
    >
      <path d={GOOSE_NECK_PATHS.burst} fill={PINK_BRIGHT} />
      <g shapeRendering="crispEdges">
        <path d={GOOSE_NECK_PATHS.outline} fill={BLUE} />
        <path d={GOOSE_NECK_PATHS.body} fill="#fff" />
        <path d={GOOSE_NECK_PATHS.shade} fill={BLUE} />
        <path d={GOOSE_NECK_PATHS.bill} fill={GOOSE_ORANGE} />
      </g>
    </svg>
  );
};

/** Display type printed out of register: a bright pink copy under the blue face. */
const Misregistered: React.FC<{
  lines: string[];
  fontSize: number;
  shift: number;
  width: number;
}> = ({ lines, fontSize, shift, width }) => {
  const block = (color: string, extra: React.CSSProperties = {}) => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width,
        color,
        fontSize,
        lineHeight: 0.88,
        ...extra,
      }}
    >
      {lines.map((line, i) => (
        <span key={i}>{line}</span>
      ))}
    </div>
  );
  return (
    <div style={{ display: 'flex', position: 'relative' }}>
      {block(PINK_BRIGHT, {
        position: 'absolute',
        left: shift,
        top: shift * 0.66,
      })}
      {block(BLUE, { mixBlendMode: 'multiply' })}
    </div>
  );
};

const Strap: React.FC<{ left?: string; right?: string }> = ({
  left = 'BUILD PRODUCTS THAT MATTER',
  right = 'MIKEBIFULCO.COM',
}) => (
  <div
    style={{
      position: 'absolute',
      left: MARGIN,
      top: STRAP_TOP,
      width: CONTENT_WIDTH,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderTop: `4px solid ${PINK}`,
      paddingTop: 22,
      fontSize: 30,
      letterSpacing: 2,
    }}
  >
    <span style={{ color: PINK }}>{left}</span>
    <span style={{ color: BLUE }}>{right}</span>
  </div>
);

const HomeCard: React.FC = () => (
  <>
    <div style={{ position: 'absolute', left: 700, top: 24, display: 'flex' }}>
      <HalftoneDisc size={470} pitch={18} />
    </div>
    <div
      style={{ position: 'absolute', left: MARGIN, top: 70, display: 'flex' }}
    >
      <Misregistered
        lines={['MIKE', 'BIFULCO']}
        fontSize={210}
        shift={9}
        width={CONTENT_WIDTH}
      />
    </div>
    {/* Rises from behind the strap's rule, as it does from the nav's */}
    <div
      style={{
        position: 'absolute',
        left: 900,
        top:
          STRAP_TOP -
          (HOME_GOOSE_HEIGHT * (GOOSE_NECK_BOUNDS.height + BURST_ROOM.top)) /
            GOOSE_NECK_BOUNDS.height,
        display: 'flex',
      }}
    >
      <Goose height={HOME_GOOSE_HEIGHT} />
    </div>
    <Strap />
  </>
);

/** Steps the title size down as it grows so it always fits three lines. */
const titleSize = (title: string) => {
  if (title.length <= 14) return 140;
  if (title.length <= 26) return 112;
  if (title.length <= 44) return 88;
  return 70;
};

const PageCard: React.FC<{ title: string; kicker?: string }> = ({
  title,
  kicker,
}) => (
  <>
    <div
      style={{ position: 'absolute', left: 830, top: -110, display: 'flex' }}
    >
      <HalftoneDisc size={460} pitch={18} />
    </div>
    <div
      style={{
        position: 'absolute',
        left: MARGIN,
        top: 34,
        width: CONTENT_WIDTH,
        display: 'flex',
        alignItems: 'flex-end',
        gap: 22,
        borderBottom: `4px solid ${BLUE}`,
      }}
    >
      <Goose height={96} />
      <span
        style={{
          color: PINK,
          fontSize: 44,
          marginBottom: 18,
          letterSpacing: 1,
        }}
      >
        MIKE BIFULCO
      </span>
    </div>
    <div
      style={{
        position: 'absolute',
        left: MARGIN,
        top: 140,
        height: STRAP_TOP - 160,
        width: TITLE_WIDTH,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: 26,
      }}
    >
      {kicker && (
        <span style={{ color: PINK, fontSize: 34, letterSpacing: 2 }}>
          {kicker.toUpperCase()}
        </span>
      )}
      <Misregistered
        lines={[title.toUpperCase()]}
        fontSize={titleSize(title)}
        shift={6}
        width={TITLE_WIDTH}
      />
    </div>
    <Strap />
  </>
);

// A pixel love letter for Tiny Improvements (the site's 💌): B ink, W paper, P seal.
const LETTER = [
  'BBBBBBBBBBBBBBBBBBBBBBBB',
  'BBWWWWWWWWWWWWWWWWWWWWBB',
  'BWBWWWWWWWWWWWWWWWWWWBWB',
  'BWWBWWWWWWWWWWWWWWWWBWWB',
  'BWWWBWWWWWWWWWWWWWWBWWWB',
  'BWWWWBWWWWWWWWWWWWBWWWWB',
  'BWWWWWBWWWWWWWWWWBWWWWWB',
  'BWWWWWWBWPPWWPPWBWWWWWWB',
  'BWWWWWWWPPPPPPPPWWWWWWWB',
  'BWWWWWWWPPPPPPPPWWWWWWWB',
  'BWWWWBWWWPPPPPPWWWBWWWWB',
  'BWWWBWWWWWPPPPWWWWWBWWWB',
  'BWWBWWWWWWWPPWWWWWWWBWWB',
  'BWBWWWWWWWWWWWWWWWWWWBWB',
  'BBWWWWWWWWWWWWWWWWWWWWBB',
  'BBBBBBBBBBBBBBBBBBBBBBBB',
];

const pixelPath = (grid: string[], char: string) =>
  grid
    .flatMap((row, y) =>
      [...row].map((cell, x) => (cell === char ? `M${x} ${y}h1v1h-1z` : ''))
    )
    .join('');

// A studio mic for the podcast, in the same pixel key.
const MIC = [
  '....BBBBBB....',
  '...BBWWWWBB...',
  '...BWWWWWWB...',
  '...BWBWBWWB...',
  '...BWWBWBWB...',
  '...BWBWBWWB...',
  '.B.BWWBWBWB.B.',
  '.B.BWWWWWWB.B.',
  '.B.BPPPPPPB.B.',
  '.B.BWWWWWWB.B.',
  '.B.BBWWWWBB.B.',
  '.B..BBBBBB..B.',
  '.B..........B.',
  '.BB........BB.',
  '..BBBBBBBBBB..',
  '......BB......',
  '......BB......',
  '......BB......',
  '......BB......',
  '......BB......',
  '......BB......',
  '...BBBBBBBB...',
  '...BBBBBBBB...',
];

const gridHeight = (grid: string[], width: number) =>
  (width * grid.length) / grid[0].length;

const PixelArt: React.FC<{ grid: string[]; width: number }> = ({
  grid,
  width,
}) => (
  <svg
    width={width}
    height={gridHeight(grid, width)}
    viewBox={`0 0 ${grid[0].length} ${grid.length}`}
    shapeRendering="crispEdges"
  >
    <path d={pixelPath(grid, 'W')} fill="#fff" />
    <path d={pixelPath(grid, 'B')} fill={BLUE} />
    <path d={pixelPath(grid, 'P')} fill={PINK_BRIGHT} />
  </svg>
);

/** The newsletter band's halftone strip, printed along the top edge. */
const HalftoneStrip: React.FC<{ color?: string }> = ({
  color = PINK_BRIGHT,
}) => {
  const pitch = 12;
  const radius = 3.4;
  let d = '';
  for (let y = pitch / 2; y < 30; y += pitch) {
    for (let x = pitch / 2; x < WIDTH; x += pitch) {
      d += `M${x - radius} ${y}a${radius} ${radius} 0 1 0 ${radius * 2} 0a${radius} ${radius} 0 1 0 ${-radius * 2} 0`;
    }
  }
  return (
    <svg width={WIDTH} height={30} viewBox={`0 0 ${WIDTH} 30`}>
      <path d={d} fill={color} />
    </svg>
  );
};

const LETTER_WIDTH = 270;

const NewsletterCard: React.FC = () => (
  <>
    <div style={{ position: 'absolute', left: 0, top: 0, display: 'flex' }}>
      <HalftoneStrip />
    </div>
    <div style={{ position: 'absolute', left: 790, top: 36, display: 'flex' }}>
      <HalftoneDisc size={380} pitch={18} />
    </div>
    {/* The letter sits on an offset blue plate, like the site's covers */}
    <div
      style={{
        position: 'absolute',
        left: 872,
        top: 78,
        display: 'flex',
        transform: 'rotate(-8deg)',
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: 14,
          top: 14,
          width: LETTER_WIDTH,
          height: gridHeight(LETTER, LETTER_WIDTH),
          background: BLUE,
          opacity: 0.85,
        }}
      />
      <PixelArt grid={LETTER} width={LETTER_WIDTH} />
    </div>
    <div
      style={{
        position: 'absolute',
        left: MARGIN,
        top: 128,
        width: CONTENT_WIDTH,
        display: 'flex',
        flexDirection: 'column',
        gap: 28,
      }}
    >
      <span style={{ color: PINK, fontSize: 32, letterSpacing: 2 }}>
        ONE TINY IDEA EACH WEEK
      </span>
      <Misregistered
        lines={['TINY', 'IMPROVEMENTS']}
        fontSize={128}
        shift={8}
        width={CONTENT_WIDTH}
      />
    </div>
    <Strap left="FOR PRODUCT BUILDERS" right="MIKEBIFULCO.COM/NEWSLETTER" />
  </>
);

const MIC_WIDTH = 120;
const PODCAST_GOOSE_HEIGHT = 200;

const PodcastCard: React.FC = () => (
  <>
    <div style={{ position: 'absolute', left: 0, top: 0, display: 'flex' }}>
      <HalftoneStrip color={BLUE} />
    </div>
    <div style={{ position: 'absolute', left: 800, top: 40, display: 'flex' }}>
      <HalftoneDisc size={380} pitch={18} />
    </div>
    {/* The goose honks straight into the mic */}
    <div
      style={{
        position: 'absolute',
        left: 1000,
        top: 214,
        display: 'flex',
        transform: 'rotate(-14deg)',
      }}
    >
      <PixelArt grid={MIC} width={MIC_WIDTH} />
    </div>
    <div
      style={{
        position: 'absolute',
        left: 846,
        top:
          STRAP_TOP -
          (PODCAST_GOOSE_HEIGHT * (GOOSE_NECK_BOUNDS.height + BURST_ROOM.top)) /
            GOOSE_NECK_BOUNDS.height,
        display: 'flex',
      }}
    >
      <Goose height={PODCAST_GOOSE_HEIGHT} />
    </div>
    <div
      style={{
        position: 'absolute',
        left: MARGIN,
        top: 120,
        width: 760,
        display: 'flex',
        flexDirection: 'column',
        gap: 26,
      }}
    >
      <span style={{ color: PINK, fontSize: 32, letterSpacing: 2 }}>
        BITE-SIZED PRODUCT ADVICE, OUT LOUD
      </span>
      <Misregistered
        lines={['TINY', 'IMPROVEMENTS']}
        fontSize={112}
        shift={7}
        width={760}
      />
      {/* Scrawled on afterwards, like a correction in the margin */}
      <span
        style={{
          color: PINK,
          fontSize: 58,
          marginTop: -6,
          marginLeft: 330,
          transform: 'rotate(-5deg)',
        }}
      >
        (THE PODCAST)
      </span>
    </div>
    <Strap left="SHORT AUDIO ESSAYS" right="MIKEBIFULCO.COM/PODCAST" />
  </>
);

const GROUNDS: Record<OgCard['kind'], string> = {
  home: STOCK,
  page: STOCK,
  newsletter: TINT_PINK,
  podcast: TINT_BLUE,
};

const CardArt: React.FC<{ card: OgCard }> = ({ card }) => {
  switch (card.kind) {
    case 'home':
      return <HomeCard />;
    case 'newsletter':
      return <NewsletterCard />;
    case 'podcast':
      return <PodcastCard />;
    case 'page':
      return <PageCard title={card.title} kicker={card.kicker} />;
  }
};

// Only the cards in getOgCards exist; any other path is a 404 rather than an
// image of whatever text the URL asks for.
export const dynamicParams = false;
export const dynamic = 'force-static';

export async function generateStaticParams() {
  const cards = await getOgCards();
  return [...cards.keys()].map((key) => ({
    slug: key ? key.split('/') : [],
  }));
}

/** A riso Open Graph card, prerendered for each path in getOgCards. */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug?: string[] }> }
) {
  const { slug = [] } = await params;
  const card = (await getOgCards()).get(slug.map(decodeURIComponent).join('/'));
  if (!card) return new Response('Not found', { status: 404 });

  return new ImageResponse(
    <div
      style={{
        width: WIDTH,
        height: HEIGHT,
        display: 'flex',
        position: 'relative',
        background: GROUNDS[card.kind],
        fontFamily: 'Dumpling',
      }}
    >
      <CardArt card={card} />
    </div>,
    {
      width: WIDTH,
      height: HEIGHT,
      fonts: [{ name: 'Dumpling', data: await dumpling, style: 'normal' }],
    }
  );
}
