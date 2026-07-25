import { expect, test } from '@playwright/test';

test.describe('markdown routes', () => {
  test('serves a post as markdown', async ({ request }) => {
    const response = await request.get('/posts/all-about-ch.md');

    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('text/markdown');

    const body = await response.text();
    expect(body.startsWith('---')).toBe(true);
    expect(body).toContain(
      'canonical: https://mikebifulco.com/posts/all-about-ch'
    );
    expect(body).toContain('# CSS talk');
    // Custom components are resolved, not passed through as raw JSX.
    expect(body).toContain('![');
    expect(body).not.toContain('<Image');
  });

  test('serves a newsletter as markdown without sponsor content', async ({
    request,
  }) => {
    const response = await request.get('/newsletter/you-are-not-your-user.md');

    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('text/markdown');

    const body = await response.text();
    expect(body).not.toContain('Tripo');
    expect(body).not.toContain('utm_medium=sponsorship');
  });

  test('links onward to other pages on the site', async ({ request }) => {
    const response = await request.get(
      '/posts/text-wrap-pretty-for-subtle-visual-balance.md'
    );
    const body = await response.text();

    // Answer-first summary, series navigation, related links and attribution:
    // without these each file is a dead end for a crawler.
    expect(body).toContain('> **TL;DR:**');
    expect(body).toContain('## Part of the CSS For Visual Balance series');
    expect(body).toContain('## More from mikebifulco.com');
    expect(body).toContain('https://mikebifulco.com/posts/');
    expect(body.trimEnd()).toMatch(
      /Written by Mike Bifulco\. Originally published at https:\/\/mikebifulco\.com\/posts\/text-wrap-pretty-for-subtle-visual-balance$/
    );
  });

  test('sends a canonical link header for search engines', async ({
    request,
  }) => {
    const response = await request.get('/posts/all-about-ch.md');

    expect(response.headers()['link']).toBe(
      '<https://mikebifulco.com/posts/all-about-ch>; rel="canonical"'
    );
  });

  test('404s for an unknown slug', async ({ request }) => {
    const response = await request.get('/posts/this-post-does-not-exist.md');

    expect(response.status()).toBe(404);
  });

  test('advertises the markdown twin on the html page', async ({ page }) => {
    await page.goto('/posts/all-about-ch');

    const href = await page
      .locator('link[rel="alternate"][type="text/markdown"]')
      .getAttribute('href');

    expect(href).toBe('https://mikebifulco.com/posts/all-about-ch.md');
  });

  test('offers a copy as markdown control', async ({ page }) => {
    await page.goto('/posts/all-about-ch');

    await expect(
      page.getByRole('button', { name: 'Copy as Markdown' })
    ).toBeVisible();

    await page.getByRole('button', { name: 'More Markdown options' }).click();

    await expect(
      page.getByRole('menuitem', { name: 'Copy link to .md' })
    ).toBeVisible();
    await expect(
      page.getByRole('menuitem', { name: 'Open .md' })
    ).toHaveAttribute('href', '/posts/all-about-ch.md');
  });

  test('serves llms-full.txt in the llms.txt house style', async ({
    request,
  }) => {
    const response = await request.get('/llms-full.txt');

    expect(response.status()).toBe(200);

    const body = await response.text();

    // Single h1, then h2 sections, then one h3 per document with its source.
    expect(body.startsWith('# mikebifulco.com\n')).toBe(true);
    expect(body).toContain('\n> The complete text of every published article');
    expect(body).toContain('\n## Articles\n');
    expect(body).toContain('\n## Newsletter Issues\n');
    expect(body).toContain('Source: https://mikebifulco.com/posts/');

    // Entries carry no YAML frontmatter: `---` fences would be
    // indistinguishable from the horizontal rules separating entries. Posts
    // that show frontmatter inside code fences are fine, so this checks entry
    // structure rather than the mere presence of the characters.
    expect(body).not.toMatch(/^### .+\n\n---$/m);
    expect(body).toMatch(/^### .+\n\nSource: https:\/\/mikebifulco\.com\//m);

    const entryHeadings = body.match(/^### /gm) ?? [];
    const sourceLines = body.match(/^Source: /gm) ?? [];
    expect(entryHeadings.length).toBeGreaterThan(150);
    // Allows for h3s appearing inside fenced code samples.
    expect(entryHeadings.length - sourceLines.length).toBeLessThanOrEqual(3);
  });

  test('documents the markdown convention in llms.txt', async ({ request }) => {
    const response = await request.get('/llms.txt');

    expect(response.status()).toBe(200);
    expect(await response.text()).toContain('## Markdown Versions');
  });
});
