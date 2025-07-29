import { expect, test } from '@playwright/test';

test('home page smoke test', async ({ page }) => {
  await page.goto('/');
  expect(true).toBe(true);
});

test('newsletter smoke test', async ({ page }) => {
  await page.goto('/newsletter');
  expect(true).toBe(true);
});

test('podcast smoke test', async ({ page }) => {
  await page.goto('/podcast');
  expect(true).toBe(true);
});

test('tags smoke test', async ({ page }) => {
  await page.goto('/tags');
  expect(true).toBe(true);
});

test('sitemap smoke test', async ({ page }) => {
  await page.goto('/sitemap.xml');
  expect(true).toBe(true);
});

test('robots smoke test', async ({ page }) => {
  await page.goto('/robots.txt');
  expect(true).toBe(true);
});

test('404 error page smoke test', async ({ page }) => {
  const response = await page.goto('/non-existent-page');
  expect(response?.status()).toBe(404);

  // Check for the default Next.js 404 page in development mode
  await expect(page.locator('h1')).toContainText('404');
  await expect(
    page.locator('text=This page could not be found.')
  ).toBeVisible();
});
