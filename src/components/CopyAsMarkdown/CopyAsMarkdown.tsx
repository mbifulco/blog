import { useState } from 'react';
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
  copied: 'Copied',
  failed: 'Copy failed',
};

/**
 * Hands the Markdown twin of the current page to the reader, for pasting into
 * an LLM or an editor. Falls back to opening the raw file if the clipboard is
 * unavailable.
 */
export const CopyAsMarkdown: React.FC<CopyAsMarkdownProps> = ({
  markdownPath,
}) => {
  const [state, setState] = useState<CopyState>('idle');

  const flash = (next: CopyState) => {
    setState(next);
    setTimeout(() => setState('idle'), RESET_DELAY_MS);
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
    <ButtonGroup>
      <Button
        variant="outline"
        size="sm"
        onClick={copyMarkdown}
        aria-label="Copy as Markdown"
      >
        {state === 'copied' ? (
          <Check className="size-4" aria-hidden />
        ) : (
          <Copy className="size-4" aria-hidden />
        )}
        <span>{LABELS[state]}</span>
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            aria-label="More Markdown options"
          >
            <ChevronDown className="size-4" aria-hidden />
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
