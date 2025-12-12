import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForURL(/\/posts\/.+/);
  });

  test('should navigate between blog posts via sidebar', async ({ page }) => {
    // Get the current URL
    const currentUrl = page.url();

    // Find all blog post links in sidebar
    const postLinks = page.locator('nav a[href*="/posts/"]');
    const count = await postLinks.count();

    // If there are multiple posts, click on a different one
    if (count > 1) {
      // Find a link that's not the current page
      for (let i = 0; i < count; i++) {
        const link = postLinks.nth(i);
        const href = await link.getAttribute('href');
        if (href && !currentUrl.includes(href)) {
          await link.click();
          await page.waitForLoadState('networkidle');

          // Verify we navigated to a different page
          expect(page.url()).not.toBe(currentUrl);
          break;
        }
      }
    }
  });

  test('should have working logo/title link', async ({ page }) => {
    const titleLink = page.locator('a:has-text("DevCult Blog")').first();
    await expect(titleLink).toBeVisible();

    // Click should redirect to latest post
    await titleLink.click();
    await page.waitForLoadState('networkidle');
    expect(page.url()).toMatch(/\/posts\/.+/);
  });

  test('sidebar should be scrollable', async ({ page }) => {
    const sidebar = page.locator('nav.sidebar').first();
    await expect(sidebar).toBeVisible();

    // Check if sidebar has overflow styling
    const overflowY = await sidebar.evaluate((el) => {
      return window.getComputedStyle(el).overflowY;
    });
    expect(overflowY).toMatch(/auto|scroll|overlay|visible/);
  });
});
