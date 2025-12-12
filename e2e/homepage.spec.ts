import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should redirect to latest blog post', async ({ page }) => {
    await page.goto('/');

    // Wait for redirect to complete
    await page.waitForURL(/\/posts\/.+/);

    // Verify we're on a blog post page
    expect(page.url()).toMatch(/\/posts\/.+/);

    // Verify the page has content (Starlight uses .sl-markdown-content)
    await expect(page.locator('.sl-markdown-content, main').first()).toBeVisible();
  });

  test('should have correct meta tags after redirect', async ({ page }) => {
    await page.goto('/');
    await page.waitForURL(/\/posts\/.+/);

    // Check for essential meta tags
    const title = await page.title();
    expect(title).toBeTruthy();
    expect(title.length).toBeGreaterThan(0);
  });
});
