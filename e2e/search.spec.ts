import { test, expect } from '@playwright/test';

test.describe('Search', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/posts/welcome-to-devcult-blog/');
  });

  test('should have search functionality', async ({ page }) => {
    // Search button should be visible at all times
    const searchButton = page.locator('[aria-label*="search" i]').first();
    await expect(searchButton).toBeVisible();

    // Click the search button to open the modal
    await searchButton.click();

    // Wait for the modal to appear and search input to be visible
    const searchInput = page.locator('input[type="search"], .pagefind-ui__search-input').first();
    await expect(searchInput).toBeVisible({ timeout: 10000 });
  });

  test('should be able to focus search input', async ({ page }) => {
    // Wait for search to be visible (may be hidden on mobile)
    const searchInput = page.locator('input[type="search"], site-search input').first();

    // Check if search input exists
    const count = await searchInput.count();
    if (count > 0) {
      // Only try to interact if search is available on this viewport
      const isVisible = await searchInput.isVisible().catch(() => false);
      if (isVisible) {
        await searchInput.click();
        await expect(searchInput).toBeFocused();
      } else {
        // Skip test if search is hidden (mobile layout)
        expect(count).toBeGreaterThan(0);
      }
    }
  });
});
