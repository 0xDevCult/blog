import { test, expect } from '@playwright/test';

test.describe('Sitemap', () => {
	test('should have sitemap index accessible', async ({ page }) => {
		const response = await page.goto('/sitemap-index.xml');
		expect(response?.status()).toBe(200);

		const contentType = response?.headers()['content-type'];
		expect(contentType).toContain('xml');
	});

	test('should have valid sitemap index structure', async ({ page }) => {
		await page.goto('/sitemap-index.xml');
		const content = await page.content();

		// Check for XML declaration
		expect(content).toContain('<?xml version="1.0"');

		// Check for sitemapindex tag
		expect(content).toContain('<sitemapindex');
		expect(content).toContain('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"');

		// Should have at least one sitemap entry
		expect(content).toContain('<sitemap>');
		expect(content).toContain('</sitemap>');
	});

	test('should include sitemap-0.xml', async ({ page }) => {
		await page.goto('/sitemap-index.xml');
		const content = await page.content();

		expect(content).toContain('sitemap-0.xml');
	});

	test('should have valid individual sitemap', async ({ page }) => {
		const response = await page.goto('/sitemap-0.xml');
		expect(response?.status()).toBe(200);

		const content = await page.content();

		// Check for XML declaration
		expect(content).toContain('<?xml version="1.0"');

		// Check for urlset tag
		expect(content).toContain('<urlset');
		expect(content).toContain('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"');

		// Should have URL entries
		expect(content).toContain('<url>');
		expect(content).toContain('<loc>');
		expect(content).toContain('</url>');
	});

	test('should include blog post URLs', async ({ page }) => {
		await page.goto('/sitemap-0.xml');
		const content = await page.content();

		// Should include the homepage
		expect(content).toMatch(/blog\.devcult\.io/);

		// Should include posts
		expect(content).toContain('/posts/');
	});

	test('should have lastmod dates', async ({ page }) => {
		await page.goto('/sitemap-0.xml');
		const content = await page.content();

		// Should have lastmod tags with dates
		expect(content).toContain('<lastmod>');
		expect(content).toMatch(/<lastmod>\d{4}-\d{2}-\d{2}/);
	});

	test('should have valid URLs (HTTPS)', async ({ page }) => {
		await page.goto('/sitemap-0.xml');
		const content = await page.content();

		// Extract URLs
		const locMatches = content.match(/<loc>(.*?)<\/loc>/g);
		expect(locMatches).toBeTruthy();

		if (locMatches) {
			locMatches.forEach((loc) => {
				const url = loc.replace(/<\/?loc>/g, '');
				// URLs should use HTTPS
				expect(url).toMatch(/^https:\/\//);
				// Should be valid URL format
				expect(() => new URL(url)).not.toThrow();
			});
		}
	});

	test('should include all main pages', async ({ page }) => {
		await page.goto('/sitemap-0.xml');
		const content = await page.content();

		// Should include homepage
		const hasHomepage =
			content.includes('blog.devcult.io/</loc>') || content.includes('blog.devcult.io</loc>');
		expect(hasHomepage).toBe(true);
	});

	test('should not include 404 page in sitemap', async ({ page }) => {
		await page.goto('/sitemap-0.xml');
		const content = await page.content();

		// Should not include 404 page
		expect(content).not.toContain('/404');
	});

	test('should have proper XML encoding', async ({ page }) => {
		await page.goto('/sitemap-0.xml');
		const content = await page.content();

		// Should have UTF-8 encoding
		expect(content).toContain('encoding="UTF-8"');
	});
});

test.describe('Sitemap Accessibility', () => {
	test('robots.txt should reference sitemap', async ({ page }) => {
		// Try to fetch robots.txt if it exists
		const response = await page.goto('/robots.txt').catch(() => null);

		if (response?.status() === 200) {
			const content = await page.content();
			// If robots.txt exists, it should reference the sitemap
			if (content.includes('Sitemap:')) {
				expect(content).toContain('sitemap');
			}
		}
		// If robots.txt doesn't exist, that's okay - this is optional
	});

	test('sitemap should be crawlable (no authentication required)', async ({ page }) => {
		const response = await page.goto('/sitemap-index.xml');

		// Should be accessible without authentication
		expect(response?.status()).toBe(200);

		// Should not redirect to login
		expect(response?.url()).toContain('sitemap-index.xml');
	});
});
