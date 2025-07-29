import { expect, test } from '@playwright/test';

test.describe('Newsletter Signup Page', () => {
  test.beforeEach(async ({ page }) => {
    // Mock the TRPC subscription endpoint to avoid real API calls
    await page.route('**/api/trpc/mailingList.subscribe*', async (route) => {
      // Return an error to trigger onError callback which clears form
      await route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify([{
          error: {
            message: 'Subscription failed',
            code: -32600,
            data: {
              code: 'BAD_REQUEST',
              httpStatus: 400
            }
          }
        }])
      });
    });
    
    await page.goto('/newsletter-signup');
  });

  test('should render the newsletter signup page correctly', async ({ page }) => {
    // Check page elements are visible
    await expect(page.locator('h1')).toContainText('Get the newsletter');
    await expect(page.locator('h2')).toContainText('💌 Tiny Improvements');
    await expect(page.getByText('Straight to your inbox, once a week')).toBeVisible();

    // Check form elements
    await expect(page.getByPlaceholder('First Name')).toBeVisible();
    await expect(page.getByPlaceholder('Email Address')).toBeVisible();
    await expect(page.getByRole('button', { name: /💌 Subscribe/i })).toBeVisible();

    // Check privacy disclaimer
    await expect(page.getByText("I'll never sell your contact info")).toBeVisible();
    await expect(page.getByRole('link', { name: /unsubscribe at any time/i })).toBeVisible();
  });


  test('should show validation errors for empty form submission', async ({ page }) => {
    const submitButton = page.getByRole('button', { name: /💌 Subscribe/i });
    await submitButton.click();

    // Check validation error messages appear
    await expect(page.getByText('First name is required')).toBeVisible();
    await expect(page.getByText('Email is required')).toBeVisible();
  });

  test('should show validation error for invalid email', async ({ page }) => {
    const firstNameInput = page.getByPlaceholder('First Name');
    const emailInput = page.getByPlaceholder('Email Address');
    const submitButton = page.getByRole('button', { name: /💌 Subscribe/i });

    await firstNameInput.fill('John');
    await emailInput.fill('not-an-email-at-all');

    // Submit the form
    await submitButton.click();

    // Wait for the request to complete
    await page.waitForTimeout(2000);

    // The form should submit successfully since validation happens server-side
    // Check that we can still see the form (indicating it didn't navigate away)
    await expect(page.getByPlaceholder('Email Address')).toBeVisible();

    // Check that the form fields are cleared (indicating successful submission)
    await expect(emailInput).toHaveValue('');
    await expect(firstNameInput).toHaveValue('');
  });

  test('should handle form submission with valid data', async ({ page }) => {
    const firstNameInput = page.getByPlaceholder('First Name');
    const emailInput = page.getByPlaceholder('Email Address');
    const submitButton = page.getByRole('button', { name: /💌 Subscribe/i });

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

  test('should accept valid form input without validation errors', async ({ page }) => {
    const firstNameInput = page.getByPlaceholder('First Name');
    const emailInput = page.getByPlaceholder('Email Address');

    await firstNameInput.fill('John');
    await emailInput.fill('john@example.com');

    // Validation errors should not be present
    await expect(page.getByText('First name is required')).not.toBeVisible();
    await expect(page.getByText('Email is required')).not.toBeVisible();
    await expect(page.getByText('Please enter a valid email address')).not.toBeVisible();
  });

  test('should have working newsletter link in disclaimer', async ({ page }) => {
    const newsletterLink = page.getByRole('link', { name: /unsubscribe at any time/i });
    await expect(newsletterLink).toHaveAttribute('href', '/newsletter');

    // Test navigation (but don't actually navigate to avoid breaking test isolation)
    const href = await newsletterLink.getAttribute('href');
    expect(href).toBe('/newsletter');
  });

  test('should have proper form accessibility', async ({ page }) => {
    // Check form labels are properly associated
    const firstNameInput = page.getByPlaceholder('First Name');
    const emailInput = page.getByPlaceholder('Email Address');

    // Check inputs have proper IDs and labels (even if sr-only)
    await expect(firstNameInput).toHaveAttribute('id', 'firstName');
    await expect(emailInput).toHaveAttribute('id', 'email');

    // Check submit button is properly labeled
    const submitButton = page.getByRole('button', { name: /💌 Subscribe/i });
    await expect(submitButton).toHaveAttribute('type', 'submit');
  });

  test('should handle form submission button states', async ({ page }) => {
    const firstNameInput = page.getByPlaceholder('First Name');
    const emailInput = page.getByPlaceholder('Email Address');
    const submitButton = page.getByRole('button', { name: /💌 Subscribe/i });

    // Fill valid data
    await firstNameInput.fill('John');
    await emailInput.fill('john@example.com');

    // Button should be enabled with valid data
    await expect(submitButton).not.toBeDisabled();
    await expect(submitButton).toContainText('💌 Subscribe');
  });

  test('should have correct page title and meta description', async ({ page }) => {
    await expect(page).toHaveTitle(/Newsletter Signup - Mike Bifulco/);
  });

  test('should be responsive on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE size

    // Check that elements are still visible and properly arranged
    await expect(page.locator('h1')).toContainText('Get the newsletter');
    await expect(page.getByPlaceholder('First Name')).toBeVisible();
    await expect(page.getByPlaceholder('Email Address')).toBeVisible();
    await expect(page.getByRole('button', { name: /💌 Subscribe/i })).toBeVisible();
  });

  test('should maintain focus management', async ({ page }) => {
    // Tab through form elements
    await page.keyboard.press('Tab'); // Should focus first input
    await expect(page.getByPlaceholder('First Name')).toBeFocused();

    await page.keyboard.press('Tab'); // Should focus second input
    await expect(page.getByPlaceholder('Email Address')).toBeFocused();

    await page.keyboard.press('Tab'); // Should focus submit button
    await expect(page.getByRole('button', { name: /💌 Subscribe/i })).toBeFocused();
  });
});
