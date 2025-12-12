import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should display blog landing page', async ({ page }) => {
    await page.goto('/');

    // Wait for page to load (no redirect anymore)
    await page.waitForLoadState('networkidle');

    // Verify we're on the homepage
    expect(page.url()).toMatch(/\/$/);

    // Verify landing page content is visible
    await expect(page.locator('h1:has-text("DevCult Blog")')).toBeVisible();
    await expect(page.locator('text=Technical insights, developer experience')).toBeVisible();
  });

  test('should show blog posts grid', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check for posts grid
    const postsGrid = page.locator('.posts-grid');
    await expect(postsGrid).toBeVisible();

    // Verify there are post cards
    const postCards = page.locator('.post-card');
    const count = await postCards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should have clickable blog post cards', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Click on the first post card
    const firstPost = page.locator('.post-card').first();
    await expect(firstPost).toBeVisible();

    await firstPost.click();

    // Should navigate to a blog post
    await page.waitForURL(/\/posts\/.+/);
    expect(page.url()).toMatch(/\/posts\/.+/);
  });

  test('should have correct meta tags', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check for essential meta tags
    const title = await page.title();
    expect(title).toBeTruthy();
    expect(title).toContain('DevCult Blog');
  });
});
