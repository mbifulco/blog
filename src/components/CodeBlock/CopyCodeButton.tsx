import { useEffect, useRef, useState } from 'react';
import { Check, Copy, X } from 'lucide-react';
import posthog from 'posthog-js';

import { Button } from '@ui/button';
import { cn } from '@utils/cn';

type CopyState = 'idle' | 'copied' | 'failed';

const RESET_DELAY_MS = 2000;

const LABELS: Record<CopyState, string> = {
  idle: 'Copy',
  copied: 'Copied!',
  failed: 'Copy failed',
};

type CopyCodeButtonProps = {
  /** Source of the code block, as it should land in the reader's clipboard. */
  code: string;
  /** Prism language tag, recorded with the analytics event. */
  language?: string;
  className?: string;
};

/**
 * Copies a code block's source to the clipboard. Sits in the corner of the
 * block itself, so the reader never has to select code by hand to steal it.
 */
export const CopyCodeButton: React.FC<CopyCodeButtonProps> = ({
  code,
  language,
  className,
}) => {
  const [state, setState] = useState<CopyState>('idle');
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (resetTimer.current) clearTimeout(resetTimer.current);
    },
    []
  );

  const flash = (next: CopyState) => {
    setState(next);
    // Replace any pending reset, so a second click gets a full window rather
    // than being cut short by the previous one's timer.
    if (resetTimer.current) clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => setState('idle'), RESET_DELAY_MS);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      posthog.capture('code_block_copy', { language });
      flash('copied');
    } catch {
      posthog.capture('code_block_copy_failed', { language });
      flash('failed');
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={copy}
      aria-label="Copy code"
      title={LABELS[state]}
      className={cn(
        // The block behind this is always the Night Owl dark background, so
        // opt out of the themed foreground colours and pin light-on-dark.
        'backdrop-blur-xs size-7 border border-white/15 bg-white/10 text-slate-300',
        'hover:bg-white/20 hover:text-white',
        'focus-visible:ring-white/40',
        // Dimmed until the reader goes looking, but never fully hidden - a
        // copy button nobody can find is not a feature.
        'opacity-70 transition-opacity focus-visible:opacity-100 group-hover:opacity-100',
        className
      )}
    >
      {state === 'copied' ? (
        <Check className="size-3.5 text-emerald-400" aria-hidden />
      ) : state === 'failed' ? (
        <X className="size-3.5 text-rose-400" aria-hidden />
      ) : (
        <Copy className="size-3.5" aria-hidden />
      )}
      {/* The control's own accessible name is fixed, so state changes are
          announced here instead. Icon-only visually - the label would double
          the button's width to say what the icon already says. */}
      <span aria-live="polite" className="sr-only">
        {LABELS[state]}
      </span>
    </Button>
  );
};
