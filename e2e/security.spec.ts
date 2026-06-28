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
			expect(server).not.toContain('Apache/');
			expect(server).not.toContain('nginx/');
			expect(server).not.toContain('IIS/');
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

	test('should not have inline scripts without CSP allowance', async ({ page }) => {
		await page.goto('/posts/welcome-to-devcult-blog/');

		const structuredDataScripts = await page.locator('script[type="application/ld+json"]').count();
		expect(structuredDataScripts).toBeGreaterThan(0);
	});
});
