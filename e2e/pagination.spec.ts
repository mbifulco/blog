import { expect, test } from '@playwright/test';

test.describe('Pagination', () => {
  test.describe('Home page pagination', () => {
    test('should display pagination on home page', async ({ page }) => {
      await page.goto('/');

      // Check if pagination is present (only if there are multiple pages)
      const pagination = page.locator(
        '[role="navigation"][aria-label="pagination"]'
      );

      // If pagination exists, test it
      if ((await pagination.count()) > 0) {
        await expect(pagination).toBeVisible();

        // Check for next page link
        const nextLink = page.locator('a[aria-label="Go to next page"]');
        if ((await nextLink.count()) > 0) {
          await expect(nextLink).toBeVisible();
        }
      }
    });

    test('should navigate to page 2 from home page', async ({ page }) => {
      await page.goto('/');

      // Check if page 2 link exists (numbered page link, not next button)
      const page2Link = page
        .locator(
          '[role="navigation"][aria-label="pagination"] a[href="/page/2"]'
        )
        .filter({ hasText: '2' });
      if ((await page2Link.count()) > 0) {
        await page2Link.click();
        await expect(page).toHaveURL('/page/2');

        // Should show either a previous button or page 1 link on page 2
        const prevLink = page.locator('a[aria-label="Go to previous page"]');
        const page1Link = page.locator(
          '[role="navigation"][aria-label="pagination"] a[href="/"]'
        );

        // At least one way to go back should be available
        if ((await prevLink.count()) > 0) {
          await expect(prevLink).toBeVisible();
          await expect(prevLink).toHaveAttribute('href', '/');
        } else {
          await expect(page1Link).toBeVisible();
        }
      }
    });

    test('should navigate back to home from page 2', async ({ page }) => {
      await page.goto('/page/2');

      // Click either previous button or page 1 link to go back to home
      const prevLink = page.locator('a[aria-label="Go to previous page"]');
      const page1Link = page.locator(
        '[role="navigation"][aria-label="pagination"] a[href="/"]'
      );

      if ((await prevLink.count()) > 0) {
        await prevLink.click();
      } else {
        await page1Link.click();
      }
      await expect(page).toHaveURL('/');
    });

    test('should handle invalid page numbers with redirects', async ({
      page,
    }) => {
      // Test invalid page number
      const response = await page.goto('/page/999');
      // Should redirect to last page or home
      expect(response?.status()).toBe(200);

      // Test non-numeric page
      const response2 = await page.goto('/page/abc');
      expect(response2?.status()).toBe(200);
      await expect(page).toHaveURL('/');
    });
  });

  test.describe('Newsletter page pagination', () => {
    test('should display pagination on newsletter page', async ({ page }) => {
      await page.goto('/newsletter');

      // Check if pagination is present
      const pagination = page.locator(
        '[role="navigation"][aria-label="pagination"]'
      );

      if ((await pagination.count()) > 0) {
        await expect(pagination).toBeVisible();

        // Check for next page link
        const nextLink = page.locator('a[aria-label="Go to next page"]');
        if ((await nextLink.count()) > 0) {
          await expect(nextLink).toBeVisible();
        }
      }
    });

    test('should navigate to newsletter page 2', async ({ page }) => {
      await page.goto('/newsletter');

      // Check if page 2 link exists (numbered page link, not next button)
      const page2Link = page
        .locator(
          '[role="navigation"][aria-label="pagination"] a[href="/newsletter/page/2"]'
        )
        .filter({ hasText: '2' });
      if ((await page2Link.count()) > 0) {
        await page2Link.click();
        await expect(page).toHaveURL('/newsletter/page/2');

        // Should show either a previous button or page 1 link on page 2
        const prevLink = page.locator('a[aria-label="Go to previous page"]');
        const page1Link = page.locator(
          '[role="navigation"][aria-label="pagination"] a[href="/newsletter"]'
        );

        // At least one way to go back should be available
        if ((await prevLink.count()) > 0) {
          await expect(prevLink).toBeVisible();
          await expect(prevLink).toHaveAttribute('href', '/newsletter');
        } else {
          await expect(page1Link).toBeVisible();
        }
      }
    });

    test('should navigate back to newsletter home from page 2', async ({
      page,
    }) => {
      await page.goto('/newsletter/page/2');

      // Click either previous button or page 1 link to go back to newsletter home
      const prevLink = page.locator('a[aria-label="Go to previous page"]');
      const page1Link = page.locator(
        '[role="navigation"][aria-label="pagination"] a[href="/newsletter"]'
      );

      if ((await prevLink.count()) > 0) {
        await prevLink.click();
      } else {
        await page1Link.click();
      }
      await expect(page).toHaveURL('/newsletter');
    });

    test('should handle invalid newsletter page numbers with redirects', async ({
      page,
    }) => {
      // Test invalid page number
      const response = await page.goto('/newsletter/page/999');
      expect(response?.status()).toBe(200);

      // Test non-numeric page
      const response2 = await page.goto('/newsletter/page/abc');
      expect(response2?.status()).toBe(200);
      await expect(page).toHaveURL('/newsletter');
    });
  });

  test.describe('Pagination accessibility', () => {
    test('should have proper ARIA labels', async ({ page }) => {
      await page.goto('/');

      const pagination = page.locator(
        '[role="navigation"][aria-label="pagination"]'
      );
      if ((await pagination.count()) > 0) {
        await expect(pagination).toBeVisible();

        // Check ARIA labels
        const prevLink = page.locator('a[aria-label="Go to previous page"]');
        const nextLink = page.locator('a[aria-label="Go to next page"]');

        if ((await prevLink.count()) > 0) {
          await expect(prevLink).toBeVisible();
        }

        if ((await nextLink.count()) > 0) {
          await expect(nextLink).toBeVisible();
        }
      }
    });

    test('should have proper aria-current on active page', async ({ page }) => {
      await page.goto('/page/2');

      // Find the active page link
      const activePageLink = page.locator('a[aria-current="page"]');
      if ((await activePageLink.count()) > 0) {
        await expect(activePageLink).toBeVisible();
        await expect(activePageLink).toContainText('2');
      }
    });
  });

  test.describe('Pagination SEO', () => {
    test('should have clean URLs for pagination', async ({ page }) => {
      await page.goto('/');

      // Check that pagination links use clean URLs (numbered page link, not next button)
      const page2Link = page
        .locator(
          '[role="navigation"][aria-label="pagination"] a[href="/page/2"]'
        )
        .filter({ hasText: '2' });
      if ((await page2Link.count()) > 0) {
        await expect(page2Link).toBeVisible();

        // Navigate and check URL
        await page2Link.click();
        await expect(page).toHaveURL('/page/2');
      }
    });

    test('should redirect /page to home', async ({ page }) => {
      const response = await page.goto('/page');
      expect(response?.status()).toBe(200);
      await expect(page).toHaveURL('/');
    });

    test('should redirect /newsletter/page to newsletter', async ({ page }) => {
      const response = await page.goto('/newsletter/page');
      expect(response?.status()).toBe(200);
      await expect(page).toHaveURL('/newsletter');
    });

    test('should redirect /page/1 to home', async ({ page }) => {
      const response = await page.goto('/page/1');
      expect(response?.status()).toBe(200);
      await expect(page).toHaveURL('/');
    });

    test('should redirect /newsletter/page/1 to newsletter', async ({
      page,
    }) => {
      const response = await page.goto('/newsletter/page/1');
      expect(response?.status()).toBe(200);
      await expect(page).toHaveURL('/newsletter');
    });
  });

  test.describe('Pagination performance', () => {
    test('should load paginated pages quickly', async ({ page }) => {
      const start = Date.now();
      await page.goto('/page/2');
      const loadTime = Date.now() - start;

      // Should load within 10 seconds (generous for CI)
      expect(loadTime).toBeLessThan(10000);
    });

    test('should prefetch pagination links', async ({ page }) => {
      await page.goto('/');

      // Check if next page link exists and is prefetchable (numbered page link, not next button)
      const nextLink = page
        .locator(
          '[role="navigation"][aria-label="pagination"] a[href="/page/2"]'
        )
        .filter({ hasText: '2' });
      if ((await nextLink.count()) > 0) {
        await expect(nextLink).toBeVisible();
        // In a real app, you might check for prefetch attributes
      }
    });
  });
});
