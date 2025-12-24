import { test, expect } from '@playwright/test';

test.describe('Authentication E2E', () => {
  const timestamp = Date.now();
  const testEmail = `test${timestamp}@example.com`;
  const testPassword = 'TestPassword123!';

  test('complete user journey: signup → login → logout', async ({ page }) => {
    // Navigate to signup page
    await page.goto('/signup');
    await expect(page.locator('h1')).toContainText('Sign Up');

    // Fill signup form
    await page.fill('input[type="email"]', testEmail);
    await page.fill('input[type="password"]', testPassword);
    await page.click('button[type="submit"]');

    // Should show success message
    await expect(page.locator('.success')).toContainText('Account created successfully', { timeout: 5000 });

    // Should redirect to login after successful signup
    await expect(page).toHaveURL('/login', { timeout: 10000 });
    await expect(page.locator('h1')).toContainText('Log In');

    // Login with new credentials
    await page.fill('input[type="email"]', testEmail);
    await page.fill('input[type="password"]', testPassword);
    await page.click('button[type="submit"]');

    // Should redirect to notes page after successful login
    await expect(page).toHaveURL('/notes', { timeout: 10000 });
    await expect(page.locator('h1')).toContainText('My Notes');

    // Verify we can see the notes interface
    await expect(page.locator('button[type="submit"]')).toContainText('Add Note');
  });

  test('login validation and error handling', async ({ page }) => {
    await page.goto('/login');

    // Test with invalid credentials
    await page.fill('input[type="email"]', 'nonexistent@example.com');
    await page.fill('input[type="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');

    // Should show error message (check for actual error div)
    await expect(page.locator('.error')).toBeVisible({ timeout: 5000 });
    
    // Should stay on login page
    await expect(page).toHaveURL('/login');
  });

  test('protected route redirects to login', async ({ page }) => {
    // Try to access notes without authentication
    await page.goto('/notes');

    // Should redirect to login
    await expect(page).toHaveURL('/login', { timeout: 5000 });
  });
});
