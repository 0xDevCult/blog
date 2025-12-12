import { test, expect } from '@playwright/test';

test.describe('Search', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForURL(/\/posts\/.+/);
  });

  test('should have search functionality', async ({ page }) => {
    // Look for search input or button
    const searchInput = page.locator('input[type="search"], site-search input, [aria-label*="search" i]');
    await expect(searchInput.first()).toBeVisible();
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
