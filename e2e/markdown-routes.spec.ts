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

  test('serves llms-full.txt', async ({ request }) => {
    const response = await request.get('/llms-full.txt');

    expect(response.status()).toBe(200);

    const body = await response.text();
    expect(body).toContain('# mikebifulco.com: full content');
    expect(body).toContain('canonical: https://mikebifulco.com/posts/');
  });

  test('documents the markdown convention in llms.txt', async ({ request }) => {
    const response = await request.get('/llms.txt');

    expect(response.status()).toBe(200);
    expect(await response.text()).toContain('## Markdown Versions');
  });
});
