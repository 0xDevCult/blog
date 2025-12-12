import { test, expect } from '@playwright/test';

test.describe('Blog Post', () => {
	test.beforeEach(async ({ page }) => {
		// Navigate directly to a blog post
		await page.goto('/posts/welcome-to-devcult-blog/');
	});

	test('should display blog post content', async ({ page }) => {
		// Check for main content (Starlight uses .sl-markdown-content)
		await expect(page.locator('.sl-markdown-content, main').first()).toBeVisible();

		// Check for heading
		const heading = page.locator('h1').first();
		await expect(heading).toBeVisible();
		const headingText = await heading.textContent();
		expect(headingText).toBeTruthy();
	});

	test('should have working navigation sidebar', async ({ page }) => {
		// Check if sidebar exists (use first() to avoid strict mode violation)
		const sidebar = page.locator('nav.sidebar, aside').first();
		await expect(sidebar).toBeVisible();

		// Check for blog posts section
		const blogPostsSection = page.locator('text=Blog Posts');
		await expect(blogPostsSection).toBeVisible();
	});

	test('should display DevCult Blog title in header', async ({ page }) => {
		const headerTitle = page.locator('header').locator('text=DevCult Blog').first();
		await expect(headerTitle).toBeVisible();
	});

	test('should have theme toggle', async ({ page }) => {
		// Look for theme select button (check if it exists in DOM, may be hidden)
		const themeButton = page.locator(
			'button[aria-label*="theme" i], select[aria-label*="theme" i]'
		);
		const count = await themeButton.count();
		expect(count).toBeGreaterThan(0);
	});

	test('should have social links in header', async ({ page }) => {
		// Check for social icons (GitHub, Twitter, LinkedIn)
		const socialLinks = page.locator(
			'a[href*="github.com"], a[href*="x.com"], a[href*="linkedin.com"]'
		);
		const count = await socialLinks.count();
		expect(count).toBeGreaterThanOrEqual(1);
	});
});
