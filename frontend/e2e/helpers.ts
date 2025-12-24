import { Page } from '@playwright/test';

/**
 * Helper function to create a test user and login
 */
export async function loginAsNewUser(page: Page, email?: string, password?: string) {
  const testEmail = email || `testuser${Date.now()}@example.com`;
  const testPassword = password || 'TestPassword123!';

  // Signup
  await page.goto('/signup');
  await page.fill('input[type="email"]', testEmail);
  await page.fill('input[type="password"]', testPassword);
  await page.click('button[type="submit"]');

  // Login
  await page.waitForURL('/login');
  await page.fill('input[type="email"]', testEmail);
  await page.fill('input[type="password"]', testPassword);
  await page.click('button[type="submit"]');

  // Wait for notes page
  await page.waitForURL('/notes');

  return { email: testEmail, password: testPassword };
}

/**
 * Helper function to create a note
 */
export async function createNote(page: Page, title: string, content: string) {
  await page.click('text=Add Note');
  await page.fill('input[placeholder*="Title"]', title);
  await page.fill('textarea[placeholder*="Content"]', content);
  await page.click('button:has-text("Save")');
}

/**
 * Helper function to clear local storage (logout)
 */
export async function logout(page: Page) {
  await page.evaluate(() => {
    localStorage.clear();
  });
  await page.goto('/login');
}
