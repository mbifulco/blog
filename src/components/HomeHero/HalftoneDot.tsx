import type { RefObject } from 'react';
import { useEffect, useRef, useState } from 'react';

import { GOOSE_NECK_BOUNDS, GOOSE_NECK_PATHS } from '@components/GooseMark';
import clsxm from '@utils/clsxm';

// Matches the CSS .riso-halftone screen this replaces, so the resting state is identical.
const SPACING = 9;
const BASE_RADIUS = 2.4;
const BASE_ALPHA = 0.6;
// Blue plate prints slightly out of register, like the masthead.
const REGISTER_OFFSET = { x: 1.4, y: 1 };

const GLYPH_IN_MS = 1600;
const GLYPH_HOLD_MS = 2200;
const GLYPH_OUT_MS = 2000;
// Each phase reaches the rim this long after the center, like ink soaking outward.
const GLYPH_SPREAD_MS = 500;
const FIRST_GLYPH_MS = 3500;
// Below this many dots across, a glyph is too coarse to read.
const MIN_GLYPH_COLS = 18;

type GlyphDraw = (ctx: CanvasRenderingContext2D, size: number) => void;

// Each glyph draws into a size x size box; it is then halftoned onto the dot grid.
const GLYPHS: GlyphDraw[] = [
  (ctx, size) => {
    const { x, y, width, height } = GOOSE_NECK_BOUNDS;
    const scale = (size * 0.86) / height;
    ctx.translate(
      (size - width * scale) / 2 - x * scale,
      size * 0.1 - y * scale
    );
    ctx.scale(scale, scale);
    for (const d of [
      GOOSE_NECK_PATHS.outline,
      GOOSE_NECK_PATHS.body,
      GOOSE_NECK_PATHS.shade,
      GOOSE_NECK_PATHS.bill,
    ]) {
      ctx.fill(new Path2D(d));
    }
  },
  (ctx, size) => {
    ctx.translate(size / 2, size * 0.53);
    ctx.scale(size / 100, size / 100);
    ctx.fill(
      new Path2D(
        'M0 30C-22 14 -36 2 -36 -14C-36 -27 -26 -35 -16 -35C-8 -35 -3 -31 0 -25C3 -31 8 -35 16 -35C26 -35 36 -27 36 -14C36 2 22 14 0 30Z'
      )
    );
  },
  (ctx, size) => {
    ctx.translate(size / 2, size / 2);
    const arm = size * 0.34;
    const thickness = size * 0.13;
    for (let i = 0; i < 3; i++) {
      ctx.fillRect(-arm, -thickness / 2, arm * 2, thickness);
      ctx.rotate(Math.PI / 3);
    }
  },
];

type Dot = {
  x: number;
  y: number;
  ox: number;
  oy: number;
  vx: number;
  vy: number;
  /** Index into a rasterized glyph. */
  cell: number;
  /** Distance from the center, 0 at the middle to 1 at the rim. */
  spread: number;
};

const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2;

/** How fully a glyph shows (0-1), `t` ms after it starts. */
const glyphPhase = (t: number) => {
  if (t <= 0) return 0;
  if (t < GLYPH_IN_MS) return easeInOutCubic(t / GLYPH_IN_MS);
  if (t < GLYPH_IN_MS + GLYPH_HOLD_MS) return 1;
  const out = (t - GLYPH_IN_MS - GLYPH_HOLD_MS) / GLYPH_OUT_MS;
  return out >= 1 ? 0 : 1 - easeInOutCubic(out);
};
const GLYPH_TOTAL_MS =
  GLYPH_IN_MS + GLYPH_HOLD_MS + GLYPH_OUT_MS + GLYPH_SPREAD_MS;

/** Coverage (0-1) of each grid cell by the glyph, sampled by area. */
const rasterizeGlyph = (draw: GlyphDraw, cols: number): Float32Array => {
  const supersample = 6;
  const big = document.createElement('canvas');
  big.width = big.height = cols * supersample;
  const bigCtx = big.getContext('2d')!;
  bigCtx.fillStyle = '#000';
  draw(bigCtx, big.width);
  const small = document.createElement('canvas');
  small.width = small.height = cols;
  const smallCtx = small.getContext('2d')!;
  smallCtx.imageSmoothingQuality = 'high';
  smallCtx.drawImage(big, 0, 0, cols, cols);
  const { data } = smallCtx.getImageData(0, 0, cols, cols);
  const out = new Float32Array(cols * cols);
  for (let i = 0; i < out.length; i++) out[i] = data[i * 4 + 3] / 255;
  return out;
};

type HalftoneDotProps = {
  /** The element whose pointer movement steers the dots; the dot itself sits behind the masthead. */
  zoneRef: RefObject<HTMLElement | null>;
  className?: string;
};

const HalftoneDot: React.FC<HalftoneDotProps> = ({ zoneRef, className }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const zone = zoneRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !zone || !ctx) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const darkScheme = window.matchMedia('(prefers-color-scheme: dark)');

    let size = 0;
    let cols = 0;
    let dots: Dot[] = [];
    let glyphs: Float32Array[] = [];
    let ink = {
      pink: '',
      blue: '',
      blend: 'multiply' as GlobalCompositeOperation,
    };

    let pointer: { x: number; y: number } | null = null;
    let ripple: { x: number; y: number; start: number } | null = null;
    let glyph: { index: number; start: number } | null = null;
    let nextGlyphIndex = 0;
    let glyphTimer: number | undefined;
    let frame: number | undefined;
    let shownFirstGlyph = false;
    let onScreen = true;
    let visible = true;

    const readInk = () => {
      const styles = getComputedStyle(document.documentElement);
      ink = {
        pink: styles.getPropertyValue('--riso-pink-bright').trim(),
        blue: styles.getPropertyValue('--riso-blue').trim(),
        blend:
          styles.getPropertyValue('--riso-blend').trim() === 'screen'
            ? 'screen'
            : 'multiply',
      };
    };

    const layout = () => {
      const rect = canvas.getBoundingClientRect();
      size = rect.width;
      if (!size) return;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = canvas.height = Math.round(size * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Tiled from the top-left corner and clipped to the circle, like the CSS
      // screen, so rim dots are cut and the outline stays round.
      cols = Math.ceil(size / SPACING);
      const inset = SPACING / 2;
      const center = size / 2;
      const limit = center + BASE_RADIUS * 2;
      dots = [];
      for (let row = 0; row < cols; row++) {
        for (let col = 0; col < cols; col++) {
          const x = inset + col * SPACING;
          const y = inset + row * SPACING;
          if (Math.hypot(x - center, y - center) > limit) continue;
          dots.push({
            x,
            y,
            ox: 0,
            oy: 0,
            vx: 0,
            vy: 0,
            cell: row * cols + col,
            spread: Math.min(1, Math.hypot(x - center, y - center) / center),
          });
        }
      }
      glyphs = GLYPHS.map((draw) => rasterizeGlyph(draw, cols));
    };

    // Returns whether anything is still moving, so the loop can stop when settled.
    const draw = (now: number) => {
      const still = reducedMotion.matches;
      const reach = size * 0.24;
      const glyphAge = glyph ? now - glyph.start : 0;
      if (glyph && glyphAge > GLYPH_TOTAL_MS) {
        glyph = null;
        scheduleGlyph();
      }
      const coverage = glyph ? glyphs[glyph.index] : null;
      const rippleAge = ripple ? now - ripple.start : 0;
      const rippleFront = rippleAge * 0.42;
      if (ripple && rippleFront > size * 1.5) ripple = null;

      let moving = glyph !== null || ripple !== null;
      const blue: [number, number, number, number][] = [];

      ctx.clearRect(0, 0, size, size);
      ctx.save();
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
      ctx.clip();
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = ink.pink;

      for (const dot of dots) {
        let press = 0;
        let tx = 0;
        let ty = 0;
        if (pointer) {
          const dx = dot.x - pointer.x;
          const dy = dot.y - pointer.y;
          const dist = Math.hypot(dx, dy) || 1;
          if (dist < reach) {
            press = (1 - dist / reach) ** 2;
            tx = (dx / dist) * press * SPACING * 1.4;
            ty = (dy / dist) * press * SPACING * 1.4;
          }
        }

        if (still) {
          dot.ox = dot.oy = 0;
        } else {
          if (ripple) {
            const dx = dot.x - ripple.x;
            const dy = dot.y - ripple.y;
            const dist = Math.hypot(dx, dy) || 1;
            const band = 1 - Math.abs(dist - rippleFront) / (SPACING * 2.2);
            if (band > 0) {
              const kick = band * 2.4 * Math.max(0, 1 - rippleAge / 1400);
              dot.vx += (dx / dist) * kick;
              dot.vy += (dy / dist) * kick;
            }
          }
          dot.vx = (dot.vx + (tx - dot.ox) * 0.16) * 0.74;
          dot.vy = (dot.vy + (ty - dot.oy) * 0.16) * 0.74;
          dot.ox += dot.vx;
          dot.oy += dot.vy;
          if (Math.abs(dot.vx) + Math.abs(dot.vy) > 0.02) moving = true;
        }

        // Reduced motion only sees a glyph someone typed, and it cuts in and out.
        const amount = !coverage
          ? 0
          : still
            ? Math.ceil(glyphPhase(glyphAge))
            : glyphPhase(glyphAge - dot.spread * GLYPH_SPREAD_MS);
        const lit = coverage ? coverage[dot.cell] * amount : 0;
        const hoverRadius = BASE_RADIUS * (1 + 0.85 * press);
        const glyphRadius =
          BASE_RADIUS * (0.4 + 1.55 * (coverage?.[dot.cell] ?? 0));
        const radius = hoverRadius + (glyphRadius - hoverRadius) * amount;
        const x = dot.x + dot.ox;
        const y = dot.y + dot.oy;

        ctx.globalAlpha = BASE_ALPHA + 0.35 * Math.max(press, lit);
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();

        const plate = Math.max(press, lit);
        if (plate > 0.04) blue.push([x, y, radius * 0.92, plate]);
      }

      ctx.globalCompositeOperation = ink.blend;
      ctx.fillStyle = ink.blue;
      for (const [x, y, radius, plate] of blue) {
        ctx.globalAlpha = Math.min(1, plate * 1.1);
        ctx.beginPath();
        ctx.arc(
          x + REGISTER_OFFSET.x,
          y + REGISTER_OFFSET.y,
          radius,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }
      ctx.restore();

      return moving;
    };

    const tick = (now: number) => {
      frame = undefined;
      if (draw(now) && visible) frame = requestAnimationFrame(tick);
    };
    const wake = () => {
      if (frame === undefined) frame = requestAnimationFrame(tick);
    };

    const scheduleGlyph = () => {
      window.clearTimeout(glyphTimer);
      if (reducedMotion.matches || !visible || cols < MIN_GLYPH_COLS) return;
      const delay = shownFirstGlyph
        ? 8000 + Math.random() * 5000
        : FIRST_GLYPH_MS;
      glyphTimer = window.setTimeout(() => {
        // A visitor playing with the dots shouldn't have a glyph interrupt them.
        if (pointer) return scheduleGlyph();
        shownFirstGlyph = true;
        glyph = { index: nextGlyphIndex, start: performance.now() };
        nextGlyphIndex = (nextGlyphIndex + 1) % GLYPHS.length;
        wake();
      }, delay);
    };

    const toLocal = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      return { x: event.clientX - rect.left, y: event.clientY - rect.top };
    };
    const insideDot = ({ x, y }: { x: number; y: number }) =>
      Math.hypot(x - size / 2, y - size / 2) <= size / 2;

    const onMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return;
      pointer = toLocal(event);
      wake();
    };
    const onLeave = () => {
      pointer = null;
      wake();
    };
    const onDown = (event: PointerEvent) => {
      const point = toLocal(event);
      if (reducedMotion.matches || !insideDot(point)) return;
      ripple = { ...point, start: performance.now() };
      wake();
    };

    const showGlyph = (index: number) => {
      if (cols < MIN_GLYPH_COLS) return;
      window.clearTimeout(glyphTimer);
      shownFirstGlyph = true;
      glyph = { index, start: performance.now() };
      wake();
    };

    // Easter egg: typing a cue anywhere on the page prints its glyph.
    const CUES: [string, number][] = [
      ['honk', 0],
      ['<3', 1],
      ['*', 2],
    ];
    let typed = '';
    const onKey = (event: KeyboardEvent) => {
      if (
        event.metaKey ||
        event.ctrlKey ||
        event.altKey ||
        event.key.length !== 1
      )
        return;
      const target = event.target as HTMLElement | null;
      if (target?.closest('input, textarea, select, [contenteditable="true"]'))
        return;
      typed = (typed + event.key.toLowerCase()).slice(-8);
      const cue = CUES.find(([word]) => typed.endsWith(word));
      if (!cue) return;
      typed = '';
      showGlyph(cue[1]);
      if (cue[0] === 'honk' && !reducedMotion.matches) {
        ripple = { x: size / 2, y: size / 2, start: performance.now() };
      }
    };

    const onScheme = () => {
      readInk();
      wake();
    };
    const onMotion = () => {
      glyph = null;
      ripple = null;
      scheduleGlyph();
      wake();
    };
    const onVisibility = () => {
      visible = document.visibilityState === 'visible' && onScreen;
      if (visible) {
        scheduleGlyph();
        wake();
      } else {
        window.clearTimeout(glyphTimer);
      }
    };

    const io = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      onVisibility();
    });
    const ro = new ResizeObserver(() => {
      layout();
      wake();
    });

    readInk();
    layout();
    draw(performance.now());
    setReady(true);
    scheduleGlyph();

    io.observe(canvas);
    ro.observe(canvas);
    zone.addEventListener('pointermove', onMove);
    zone.addEventListener('pointerleave', onLeave);
    zone.addEventListener('pointerdown', onDown);
    darkScheme.addEventListener('change', onScheme);
    window.addEventListener('keydown', onKey);
    console.info('🪿 Psst: type "honk" on this page.');
    reducedMotion.addEventListener('change', onMotion);
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      if (frame !== undefined) cancelAnimationFrame(frame);
      window.clearTimeout(glyphTimer);
      io.disconnect();
      ro.disconnect();
      zone.removeEventListener('pointermove', onMove);
      zone.removeEventListener('pointerleave', onLeave);
      zone.removeEventListener('pointerdown', onDown);
      darkScheme.removeEventListener('change', onScheme);
      window.removeEventListener('keydown', onKey);
      reducedMotion.removeEventListener('change', onMotion);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [zoneRef]);

  return (
    <div
      aria-hidden
      className={clsxm(
        'hero-halftone aspect-square',
        // The CSS screen shows until the canvas has drawn its first frame.
        !ready && 'riso-halftone rounded-full opacity-60',
        className
      )}
    >
      <canvas
        ref={canvasRef}
        className="block h-full w-full [mix-blend-mode:var(--riso-blend)]"
      />
    </div>
  );
};

export default HalftoneDot;
