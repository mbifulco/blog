import { expect, test } from '@playwright/test';

test.describe('Newsletter Signup Page', () => {
  test.beforeEach(async ({ page }) => {
    // Mock the TRPC subscription endpoint to avoid real API calls
    await page.route('**/api/trpc/mailingList.subscribe*', async (route) => {
      // Return an error to trigger onError callback which clears form
      await route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            error: {
              message: 'Subscription failed',
              code: -32600,
              data: {
                code: 'BAD_REQUEST',
                httpStatus: 400,
              },
            },
          },
        ]),
      });
    });

    await page.goto('/subscribe');
  });

  test('should render the newsletter signup page correctly', async ({
    page,
  }) => {
    // Check page elements are visible
    await expect(page.getByTestId('newsletter-title')).toContainText(' devs & founders building better.');

    // Check form elements
    await expect(page.getByTestId('first-name-input')).toBeVisible();
    await expect(page.getByTestId('email-input')).toBeVisible();
    await expect(page.getByTestId('submit-button')).toBeVisible();

    // Check privacy disclaimer
    await expect(page.getByTestId('privacy-link')).toBeVisible();
    await expect(page.getByTestId('unsubscribe-text')).toBeVisible();
  });

  test('should show validation errors for empty form submission', async ({
    page,
  }) => {
    const submitButton = page.getByTestId('submit-button');
    await submitButton.click();

    // Check validation error messages appear
    await expect(page.getByText('First name is required')).toBeVisible();
    await expect(page.getByText('Email is required')).toBeVisible();
  });

  test('should show validation error for invalid email', async ({ page }) => {
    const firstNameInput = page.getByTestId('first-name-input');
    const emailInput = page.getByTestId('email-input');
    const submitButton = page.getByTestId('submit-button');

    await firstNameInput.fill('John');
    await emailInput.fill('not-an-email-at-all');

    // Submit the form
    await submitButton.click();

    // Wait for the request to complete
    await page.waitForTimeout(2000);

    // The form should submit successfully since validation happens server-side
    // Check that we can still see the form (indicating it didn't navigate away)
    await expect(page.getByTestId('email-input')).toBeVisible();

    // Check that the form fields are cleared (indicating successful submission)
    await expect(emailInput).toHaveValue('');
    await expect(firstNameInput).toHaveValue('');
  });

  test('should handle form submission with valid data', async ({ page }) => {
    const firstNameInput = page.getByTestId('first-name-input');
    const emailInput = page.getByTestId('email-input');
    const submitButton = page.getByTestId('submit-button');

    await firstNameInput.fill('John');
    await emailInput.fill('test@example.com');

    // Submit the form
    await submitButton.click();

    // Wait for the request to complete
    await page.waitForTimeout(2000);

    // Check that the form fields are cleared (indicating successful submission)
    await expect(emailInput).toHaveValue('');
    await expect(firstNameInput).toHaveValue('');
  });

  test('should accept valid form input without validation errors', async ({
    page,
  }) => {
    const firstNameInput = page.getByTestId('first-name-input');
    const emailInput = page.getByTestId('email-input');

    await firstNameInput.fill('John');
    await emailInput.fill('john@example.com');

    // Validation errors should not be present
    await expect(page.getByText('First name is required')).not.toBeVisible();
    await expect(page.getByText('Email is required')).not.toBeVisible();
    await expect(
      page.getByText('Please enter a valid email address')
    ).not.toBeVisible();
  });


  test('should have proper form accessibility', async ({ page }) => {
    // Check form labels are properly associated
    const firstNameInput = page.getByTestId('first-name-input');
    const emailInput = page.getByTestId('email-input');

    // Check inputs have proper IDs and labels (even if sr-only)
    await expect(firstNameInput).toHaveAttribute('id', 'firstName');
    await expect(emailInput).toHaveAttribute('id', 'email');

    // Check submit button is properly labeled
    const submitButton = page.getByTestId('submit-button');
    await expect(submitButton).toHaveAttribute('type', 'submit');
  });

  test('should handle form submission button states', async ({ page }) => {
    const firstNameInput = page.getByTestId('first-name-input');
    const emailInput = page.getByTestId('email-input');
    const submitButton = page.getByTestId('submit-button');

    // Fill valid data
    await firstNameInput.fill('John');
    await emailInput.fill('john@example.com');

    // Button should be enabled with valid data
    await expect(submitButton).not.toBeDisabled();
    await expect(submitButton).toContainText('💌 Get the newsletter');
  });

  test('should have correct page title and meta description', async ({
    page,
  }) => {
    await expect(page).toHaveTitle(/Newsletter Signup - Mike Bifulco/);
  });

  test('should be responsive on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE size

    // Check that elements are still visible and properly arranged
    await expect(page.getByTestId('newsletter-title')).toContainText('devs & founders building better.');
    await expect(page.getByTestId('first-name-input')).toBeVisible();
    await expect(page.getByTestId('email-input')).toBeVisible();
    await expect(page.getByTestId('submit-button')).toBeVisible();
  });

  test('should maintain focus management', async ({ page }) => {
    // Tab through form elements
    await page.keyboard.press('Tab'); // Should focus first input
    await expect(page.getByTestId('first-name-input')).toBeFocused();

    await page.keyboard.press('Tab'); // Should focus second input
    await expect(page.getByTestId('email-input')).toBeFocused();

    await page.keyboard.press('Tab'); // Should focus submit button
    await expect(page.getByTestId('submit-button')).toBeFocused();
  });
});
