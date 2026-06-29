import { test, expect } from '@playwright/test';

// Security headers (HSTS, CSP, X-Frame-Options, etc.) are declared in dist/_headers
// for Netlify/Vercel deployments and are NOT served by `astro preview` or GitHub Pages.
// Those header checks belong in production smoke tests, not in e2e tests against preview.

test.describe('Security Best Practices', () => {
	test('should not expose server information', async ({ page }) => {
		const response = await page.goto('/');
		const headers = response?.headers();

		expect(headers).toBeTruthy();
		if (headers) {
			const server = headers['server'];
			if (server !== undefined) {
				expect(server).not.toContain('Apache/');
				expect(server).not.toContain('nginx/');
				expect(server).not.toContain('IIS/');
			}
		}
	});

	test('should have secure cookie settings', async ({ page, context }) => {
		await page.goto('/');
		const cookies = await context.cookies();

		cookies.forEach((cookie) => {
			if (cookie.name !== '__playwright') {
				expect(cookie.secure).toBe(true);
				expect(cookie.httpOnly).toBe(true);
			}
		});
	});

	test('all blog posts should have JSON-LD structured data', async ({ page }) => {
		await page.goto('/');

		const postHrefs = await page
			.locator('article.post-card a.post-link')
			.evaluateAll((els) => els.map((el) => el.getAttribute('href')).filter(Boolean));

		expect(postHrefs.length).toBeGreaterThan(0);

		for (const href of postHrefs) {
			await page.goto(href!);
			const count = await page.locator('script[type="application/ld+json"]').count();
			expect(count, `Missing JSON-LD on ${href}`).toBeGreaterThan(0);
		}
	});
});
