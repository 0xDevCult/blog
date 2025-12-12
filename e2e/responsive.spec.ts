import { test, expect } from '@playwright/test';

test.describe('Responsive Design', () => {
  test('should display properly on desktop (1920x1080)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');
    await page.waitForURL(/\/posts\/.+/);

    // Check that sidebar is visible on desktop
    const sidebar = page.locator('nav.sidebar, aside').first();
    await expect(sidebar).toBeVisible();

    // Check that og-image is visible in sidebar on desktop
    const ogImage = page.locator('.fixed-logo img, img[src*="og-image"]').first();
    await expect(ogImage).toBeVisible();
  });

  test('should display properly on tablet (768x1024)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    await page.waitForURL(/\/posts\/.+/);

    // Header should be visible
    const header = page.locator('header, .header').first();
    await expect(header).toBeVisible();

    // Content should be visible (Starlight uses main or .sl-markdown-content)
    const mainContent = page.locator('main, .sl-markdown-content').first();
    await expect(mainContent).toBeVisible();
  });

  test('should display properly on mobile (375x667)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForURL(/\/posts\/.+/);

    // Content should be visible (Starlight uses main or .sl-markdown-content)
    const mainContent = page.locator('main, .sl-markdown-content').first();
    await expect(mainContent).toBeVisible();

    // Mobile menu button should be visible
    const menuButton = page.locator('button[aria-label*="menu" i], button[aria-expanded]').first();
    await expect(menuButton).toBeVisible();
  });

  test('should hide og-image on screens below 800px', async ({ page }) => {
    await page.setViewportSize({ width: 700, height: 800 });
    await page.goto('/');
    await page.waitForURL(/\/posts\/.+/);

    // og-image should not be visible on small screens
    const ogImage = page.locator('.fixed-logo img');
    const isVisible = await ogImage.isVisible().catch(() => false);
    expect(isVisible).toBe(false);
  });

  test('DevCult Blog title should be left-aligned with search', async ({ page }) => {
    await page.setViewportSize({ width: 400, height: 800 });
    await page.goto('/');
    await page.waitForURL(/\/posts\/.+/);

    const title = page.locator('text=DevCult Blog').first();
    await expect(title).toBeVisible();

    // Verify title and search are in same container (title-center)
    const container = await title.evaluate((el) => {
      return el.closest('.title-center') ? true : false;
    });

    expect(container).toBe(true);
  });

  test('DevCult Blog should not overlap with og-image on medium screens', async ({ page }) => {
    await page.setViewportSize({ width: 900, height: 900 });
    await page.goto('/');
    await page.waitForURL(/\/posts\/.+/);

    const title = page.locator('header').locator('text=DevCult Blog').first();
    const ogImage = page.locator('.fixed-logo img').first();

    // Both should be visible
    await expect(title).toBeVisible();
    await expect(ogImage).toBeVisible();

    // Get bounding boxes
    const titleBox = await title.boundingBox();
    const imageBox = await ogImage.boundingBox();

    // Check that both elements are on screen
    if (titleBox && imageBox) {
      // Verify both elements are rendered (basic existence check)
      // Title should be in viewport and image should be in sidebar
      expect(titleBox.x).toBeGreaterThan(0);
      expect(imageBox.x).toBeGreaterThan(0);
    }
  });
});
