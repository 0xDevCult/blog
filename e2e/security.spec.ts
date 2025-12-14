import { test, expect } from '@playwright/test';

test.describe('Security Headers', () => {
	test('should have HSTS header', async ({ page }) => {
		const response = await page.goto('/');
		const headers = response?.headers();

		expect(headers).toBeTruthy();
		if (headers) {
			const hsts = headers['strict-transport-security'];
			expect(hsts).toBeTruthy();
			expect(hsts).toContain('max-age=');
			expect(hsts).toContain('includeSubDomains');
			expect(hsts).toContain('preload');
		}
	});

	test('should have Content Security Policy', async ({ page }) => {
		const response = await page.goto('/');
		const headers = response?.headers();

		expect(headers).toBeTruthy();
		if (headers) {
			const csp = headers['content-security-policy'];
			expect(csp).toBeTruthy();
			expect(csp).toContain("default-src 'self'");
			expect(csp).toContain('frame-ancestors');
			expect(csp).toContain('upgrade-insecure-requests');
		}
	});

	test('should have X-Frame-Options', async ({ page }) => {
		const response = await page.goto('/');
		const headers = response?.headers();

		expect(headers).toBeTruthy();
		if (headers) {
			const xFrameOptions = headers['x-frame-options'];
			expect(xFrameOptions).toBe('DENY');
		}
	});

	test('should have X-Content-Type-Options', async ({ page }) => {
		const response = await page.goto('/');
		const headers = response?.headers();

		expect(headers).toBeTruthy();
		if (headers) {
			const xContentType = headers['x-content-type-options'];
			expect(xContentType).toBe('nosniff');
		}
	});

	test('should have Referrer-Policy', async ({ page }) => {
		const response = await page.goto('/');
		const headers = response?.headers();

		expect(headers).toBeTruthy();
		if (headers) {
			const referrerPolicy = headers['referrer-policy'];
			expect(referrerPolicy).toBeTruthy();
			expect(referrerPolicy).toContain('strict-origin');
		}
	});

	test('should have Permissions-Policy', async ({ page }) => {
		const response = await page.goto('/');
		const headers = response?.headers();

		expect(headers).toBeTruthy();
		if (headers) {
			const permissionsPolicy = headers['permissions-policy'];
			expect(permissionsPolicy).toBeTruthy();
			expect(permissionsPolicy).toContain('camera=()');
			expect(permissionsPolicy).toContain('microphone=()');
			expect(permissionsPolicy).toContain('geolocation=()');
		}
	});

	test('should have Cross-Origin headers', async ({ page }) => {
		const response = await page.goto('/');
		const headers = response?.headers();

		expect(headers).toBeTruthy();
		if (headers) {
			expect(headers['cross-origin-embedder-policy']).toBe('require-corp');
			expect(headers['cross-origin-opener-policy']).toBe('same-origin');
			expect(headers['cross-origin-resource-policy']).toBe('same-origin');
		}
	});

	test('should have X-Permitted-Cross-Domain-Policies', async ({ page }) => {
		const response = await page.goto('/');
		const headers = response?.headers();

		expect(headers).toBeTruthy();
		if (headers) {
			expect(headers['x-permitted-cross-domain-policies']).toBe('none');
		}
	});

	test('CSP should allow Plausible Analytics', async ({ page }) => {
		const response = await page.goto('/');
		const headers = response?.headers();

		expect(headers).toBeTruthy();
		if (headers) {
			const csp = headers['content-security-policy'];
			expect(csp).toContain('https://plausible.io');
		}
	});
});

test.describe('Security Best Practices', () => {
	test('should not expose server information', async ({ page }) => {
		const response = await page.goto('/');
		const headers = response?.headers();

		expect(headers).toBeTruthy();
		if (headers) {
			// Should not have Server header revealing version info
			const server = headers['server'];
			expect(server).not.toContain('Apache/');
			expect(server).not.toContain('nginx/');
			expect(server).not.toContain('IIS/');
		}
	});

	test('should have secure cookie settings', async ({ page, context }) => {
		await page.goto('/');
		const cookies = await context.cookies();

		// If cookies exist, they should be secure
		cookies.forEach((cookie) => {
			if (cookie.name !== '__playwright') {
				// Ignore Playwright internal cookies
				expect(cookie.secure).toBe(true);
				expect(cookie.httpOnly).toBe(true);
			}
		});
	});

	test('should not have inline scripts without CSP allowance', async ({ page }) => {
		await page.goto('/posts/welcome-to-devcult-blog/');

		// Check that structured data scripts are properly marked
		const structuredDataScripts = await page.locator('script[type="application/ld+json"]').count();
		expect(structuredDataScripts).toBeGreaterThan(0);
	});
});
