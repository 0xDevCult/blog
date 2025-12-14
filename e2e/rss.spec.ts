import { test, expect } from '@playwright/test';

test.describe('RSS Feed', () => {
	test('should be accessible and valid', async ({ page }) => {
		const response = await page.goto('/rss.xml');
		expect(response?.status()).toBe(200);

		const contentType = response?.headers()['content-type'];
		expect(contentType).toContain('xml');

		const content = await page.content();
		expect(content).toContain('<?xml version="1.0"');
		expect(content).toContain('<rss version="2.0"');
		expect(content).toContain('DevCult Blog');
	});

	test('should include recent posts', async ({ page }) => {
		await page.goto('/rss.xml');
		const content = await page.content();

		// Should have at least one item
		expect(content).toContain('<item>');
		expect(content).toContain('<title>');
		expect(content).toContain('<link>');
		expect(content).toContain('<description>');
		expect(content).toContain('<pubDate>');
	});

	test('should have proper RSS structure', async ({ page }) => {
		await page.goto('/rss.xml');
		const content = await page.content();

		// Check for required RSS 2.0 elements
		expect(content).toContain('<channel>');
		expect(content).toContain('</channel>');
		expect(content).toContain('</rss>');

		// Check for metadata
		expect(content).toContain('<language>en-us</language>');
	});

	test('should include valid URLs', async ({ page }) => {
		await page.goto('/rss.xml');
		const content = await page.content();

		// URLs should start with http
		const linkMatches = content.match(/<link>(.*?)<\/link>/g);
		expect(linkMatches).toBeTruthy();

		if (linkMatches) {
			linkMatches.forEach((link) => {
				const url = link.replace(/<\/?link>/g, '');
				expect(url).toMatch(/^https?:\/\//);
			});
		}
	});
});
