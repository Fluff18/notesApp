import { test, expect } from '@playwright/test';

test.describe('Notes CRUD E2E', () => {
  const testPassword = 'TestPassword123!';

  // Helper function to create and login a unique user
  async function signupAndLogin(page: any) {
    const uniqueEmail = `testuser${Date.now()}${Math.random()}@example.com`;
    
    // Signup
    await page.goto('/signup');
    await page.fill('input[type="email"]', uniqueEmail);
    await page.fill('input[type="password"]', testPassword);
    await page.click('button[type="submit"]');

    // Wait for redirect to login
    await page.waitForURL('/login', { timeout: 10000 });

    // Login
    await page.fill('input[type="email"]', uniqueEmail);
    await page.fill('input[type="password"]', testPassword);
    await page.click('button[type="submit"]');

    // Wait for notes page
    await page.waitForURL('/notes', { timeout: 10000 });
    
    return uniqueEmail;
  }

  test('full notes workflow: create → read → update → delete', async ({ page }) => {
    // Signup and login
    await signupAndLogin(page);
    
    // Verify we're on notes page
    await expect(page.locator('h1')).toContainText('My Notes');

    // CREATE: Add a new note
    const noteTitle = `Test Note ${Date.now()}`;
    const noteContent = 'This is a test note created by E2E test';

    // Fill the form (it's always visible on the page)
    await page.fill('input#title', noteTitle);
    await page.fill('textarea#content', noteContent);
    await page.click('button[type="submit"]');

    // READ: Verify note appears in list
    await expect(page.locator(`text=${noteTitle}`)).toBeVisible({ timeout: 5000 });

    // UPDATE: Edit the note
    await page.click('button.edit-btn >> nth=0');
    
    const updatedTitle = `${noteTitle} - Updated`;
    await page.fill('input#edit-title', updatedTitle);
    await page.click('button:has-text("Save Changes")');

    // Verify updated note
    await expect(page.locator(`text=${updatedTitle}`)).toBeVisible({ timeout: 5000 });

    // DELETE: Remove the note
    // Handle confirmation dialog
    page.on('dialog', dialog => dialog.accept());
    
    await page.click('button.delete-btn >> nth=0');

    // Verify note is removed
    await expect(page.locator(`text=${updatedTitle}`)).not.toBeVisible({ timeout: 5000 });
  });

  test('can create multiple notes', async ({ page }) => {
    // Signup and login
    await signupAndLogin(page);

    // Verify we're on notes page
    await expect(page.locator('h1')).toContainText('My Notes');

    // Create first note
    await page.fill('input#title', 'Note 1');
    await page.fill('textarea#content', 'First note content');
    await page.click('button[type="submit"]');

    await expect(page.locator('text=Note 1')).toBeVisible({ timeout: 5000 });

    // Create second note
    await page.fill('input#title', 'Note 2');
    await page.fill('textarea#content', 'Second note content');
    await page.click('button[type="submit"]');

    // Verify both notes are visible
    await expect(page.locator('text=Note 1')).toBeVisible();
    await expect(page.locator('text=Note 2')).toBeVisible();
  });
});
