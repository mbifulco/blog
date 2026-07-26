import { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown, Copy, ExternalLink, Link2 } from 'lucide-react';
import posthog from 'posthog-js';

import { Button } from '@ui/button';
import { ButtonGroup } from '@ui/button-group';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@ui/dropdown-menu';

type CopyState = 'idle' | 'copied' | 'failed';

type CopyAsMarkdownProps = {
  /** Site-relative path to the Markdown twin, e.g. `/posts/all-about-ch.md`. */
  markdownPath: string;
};

const RESET_DELAY_MS = 2000;

const LABELS: Record<CopyState, string> = {
  idle: 'Copy as Markdown',
  copied: 'Copied!',
  failed: 'Copy failed',
};

/**
 * Hands the Markdown twin of the current page to the reader, for pasting into
 * an LLM or an editor. When a copy fails the button reports it and the menu
 * still offers opening the raw file directly.
 */
export const CopyAsMarkdown: React.FC<CopyAsMarkdownProps> = ({
  markdownPath,
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

  const copyMarkdown = async () => {
    try {
      const response = await fetch(markdownPath);
      if (!response.ok) throw new Error(`Unexpected status ${response.status}`);

      await navigator.clipboard.writeText(await response.text());
      posthog.capture('markdown_copy_content', { path: markdownPath });
      flash('copied');
    } catch {
      posthog.capture('markdown_copy_failed', { path: markdownPath });
      flash('failed');
    }
  };

  const copyLink = async () => {
    try {
      // Share the absolute URL, resolved against wherever the page is served.
      await navigator.clipboard.writeText(
        new URL(markdownPath, window.location.origin).toString()
      );
      posthog.capture('markdown_copy_link', { path: markdownPath });
      flash('copied');
    } catch {
      flash('failed');
    }
  };

  return (
    // Full width on small screens where it sits on its own line, intrinsic
    // width once it shares a row with the date and tags.
    <ButtonGroup className="w-full sm:w-fit">
      <Button
        variant="outline"
        size="sm"
        onClick={copyMarkdown}
        aria-label="Copy as Markdown"
        className="flex-1 justify-center text-xs sm:flex-none"
      >
        {state === 'copied' ? (
          <Check className="size-3.5" aria-hidden />
        ) : (
          <Copy className="size-3.5" aria-hidden />
        )}
        {/* Reserve the widest label's width so swapping copy for "Copied!" or
            "Copy failed" does not resize the button mid-interaction. Sized on
            the label rather than the group, so the chevron stays inside and
            the control still stretches on small screens. */}
        <span className="min-w-[7rem] text-left">{LABELS[state]}</span>
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            aria-label="More Markdown options"
            className="shrink-0 text-xs"
          >
            <ChevronDown className="size-3.5" aria-hidden />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={copyLink}>
            <Link2 className="size-4" aria-hidden />
            Copy link to .md
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <a
              href={markdownPath}
              onClick={() =>
                posthog.capture('markdown_open', { path: markdownPath })
              }
            >
              <ExternalLink className="size-4" aria-hidden />
              Open .md
            </a>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
  );
};
