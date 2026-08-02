import { test as base, expect } from '@playwright/test';

/** Session key `useNewsletterModalTrigger` checks before opening the modal. */
const MODAL_SHOWN_KEY = 'newsletter_modal_shown';

/**
 * The base Playwright `test` with the newsletter modal kept shut.
 *
 * `useNewsletterModalTrigger` opens the modal once a visitor passes 50% scroll
 * depth (or sits on a page for 30 seconds). Playwright scrolls elements into
 * view before clicking them, so reaching anything near the bottom of a page —
 * the pagination controls, say — trips that trigger, and the modal's overlay
 * then swallows the click. Whether the click or the modal wins is a race, which
 * is why it only failed on slower CI runs.
 *
 * Seeding the "already shown" flag puts every test in the same position as a
 * reader who has seen the modal earlier in the session. Tests that want the
 * modal should import `test` from `@playwright/test` directly and clear it.
 */
export const test = base.extend({
  page: async ({ page }, use) => {
    await page.addInitScript((key) => {
      try {
        window.sessionStorage.setItem(key, 'true');
      } catch {
        // sessionStorage is unavailable on some origins; the modal is not the
        // thing under test, so a failure here should not fail the test.
      }
    }, MODAL_SHOWN_KEY);

    await use(page);
  },
});

export { expect };
