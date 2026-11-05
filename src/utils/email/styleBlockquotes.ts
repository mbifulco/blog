// Mirrors the site's MDX blockquote: riso-blue text wrapped in riso-pink quote marks.
const QUOTE_TEXT_STYLE =
  'margin:0 0 12px 0;font-size:24px;line-height:1.375;color:#2340b0';
const QUOTE_MARK_STYLE = 'color:#c21469';

// React Email's <Markdown> inlines the body paragraph style onto every <p>,
// including those inside a blockquote, so the quote styling has to be applied
// to the rendered HTML rather than through markdownCustomStyles.
export function styleBlockquotes(html: string): string {
  return html.replace(
    /<blockquote\b[^>]*>[\s\S]*?<\/blockquote>/g,
    (blockquote) => {
      const restyled = blockquote
        .replace(/<p style="[^"]*">/g, `<p style="${QUOTE_TEXT_STYLE}">`)
        .replace(
          /(<p style="[^"]*">)/,
          `$1<span style="${QUOTE_MARK_STYLE}">&ldquo;</span>`
        );

      const lastParagraphEnd = restyled.lastIndexOf('</p>');
      if (lastParagraphEnd === -1) return restyled;

      return (
        restyled.slice(0, lastParagraphEnd) +
        `<span style="${QUOTE_MARK_STYLE}">&rdquo;</span>` +
        restyled.slice(lastParagraphEnd)
      );
    }
  );
}
