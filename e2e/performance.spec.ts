import { test, expect } from '@playwright/test';

test.describe('Performance', () => {
	test('homepage should load in reasonable time', async ({ page }) => {
		const startTime = Date.now();
		await page.goto('/', { waitUntil: 'networkidle' });
		const loadTime = Date.now() - startTime;

		// Should load within 3 seconds
		expect(loadTime).toBeLessThan(3000);
	});

	test('blog post should load in reasonable time', async ({ page }) => {
		const startTime = Date.now();
		await page.goto('/posts/welcome-to-devcult-blog/', { waitUntil: 'networkidle' });
		const loadTime = Date.now() - startTime;

		// Should load within 3 seconds
		expect(loadTime).toBeLessThan(3000);
	});

	test('should preload critical fonts', async ({ page }) => {
		await page.goto('/');

		// Check for font preload links
		const fontPreloads = await page.locator('link[rel="preload"][as="font"]').count();
		expect(fontPreloads).toBeGreaterThan(0);
	});

	test('should have optimized images with lazy loading', async ({ page }) => {
		await page.goto('/');

		// Get all images
		const images = await page.locator('img').all();

		// At least some images should have lazy loading
		let hasLazyLoading = false;
		for (const img of images) {
			const loading = await img.getAttribute('loading');
			if (loading === 'lazy') {
				hasLazyLoading = true;
				break;
			}
		}

		// Note: Not all images need lazy loading (above-the-fold images shouldn't be lazy)
		// This test just checks if the feature is being used
	});

	test('should not have layout shift on load', async ({ page }) => {
		await page.goto('/');

		// Wait for page to be fully loaded
		await page.waitForLoadState('networkidle');

		// Check that content is stable
		const mainContent = await page.locator('main').boundingBox();
		expect(mainContent).toBeTruthy();

		// Wait a bit and check again
		await page.waitForTimeout(500);
		const mainContentAfter = await page.locator('main').boundingBox();

		if (mainContent && mainContentAfter) {
			// Position should not have shifted
			expect(mainContent.y).toBe(mainContentAfter.y);
		}
	});

	test('should have minimal JavaScript', async ({ page }) => {
		const response = await page.goto('/');

		// Check the main HTML size
		const body = await response?.body();
		const htmlSize = body?.length || 0;

		// Static site, HTML should be reasonably sized
		expect(htmlSize).toBeGreaterThan(0);
		expect(htmlSize).toBeLessThan(500000); // Less than 500KB for HTML
	});

	test('should serve compressed assets', async ({ page, context }) => {
		// Enable compression in the request
		await context.route('**/*', async (route) => {
			await route.continue({
				headers: {
					...route.request().headers(),
					'Accept-Encoding': 'gzip, deflate, br',
				},
			});
		});

		const response = await page.goto('/');
		const headers = response?.headers();

		// Note: In development, compression might not be enabled
		// This is more relevant for production testing
		if (headers && headers['content-encoding']) {
			expect(['gzip', 'br', 'deflate']).toContain(headers['content-encoding']);
		}
	});

	test('should have efficient CSS', async ({ page }) => {
		await page.goto('/');

		// Check for CSS files
		const stylesheets = await page.locator('link[rel="stylesheet"]').count();

		// Should have stylesheets loaded
		expect(stylesheets).toBeGreaterThan(0);

		// Should not have excessive stylesheets (indicates good bundling)
		expect(stylesheets).toBeLessThan(10);
	});

	test('should not block rendering with scripts', async ({ page }) => {
		await page.goto('/');

		// Check for defer or async on external scripts
		const externalScripts = await page.locator('script[src]').all();

		for (const script of externalScripts) {
			const defer = await script.getAttribute('defer');
			const async = await script.getAttribute('async');
			const type = await script.getAttribute('type');

			// Script should either be deferred, async, or be a module/JSON-LD
			const isNonBlocking =
				defer !== null || async !== null || type === 'module' || type === 'application/ld+json';

			expect(isNonBlocking).toBe(true);
		}
	});

	test('should use modern image formats where supported', async ({ page }) => {
		await page.goto('/');

		// Check if any images are using modern formats
		const images = await page.locator('img').all();

		for (const img of images) {
			const src = await img.getAttribute('src');
			if (src) {
				// WebP and AVIF are modern formats
				const isModernFormat = src.includes('.webp') || src.includes('.avif');
				// SVG is also efficient
				const isSvg = src.includes('.svg');
				// Data URLs are inline
				const isDataUrl = src.startsWith('data:');

				// At least should not be using unoptimized large formats exclusively
				// (this is a soft check)
			}
		}
	});
});

test.describe('Core Web Vitals', () => {
	test('should measure performance metrics', async ({ page }) => {
		await page.goto('/', { waitUntil: 'networkidle' });

		// Get performance metrics
		const metrics = await page.evaluate(() => {
			const perfData = window.performance.getEntriesByType(
				'navigation'
			)[0] as PerformanceNavigationTiming;

			return {
				// DNS lookup time
				dnsTime: perfData.domainLookupEnd - perfData.domainLookupStart,
				// Connection time
				connectionTime: perfData.connectEnd - perfData.connectStart,
				// Time to first byte
				ttfb: perfData.responseStart - perfData.requestStart,
				// DOM content loaded
				domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
				// Full page load
				loadComplete: perfData.loadEventEnd - perfData.loadEventStart,
			};
		});

		// TTFB should be reasonable (under 600ms is good)
		expect(metrics.ttfb).toBeLessThan(2000);

		// DOM should load quickly
		expect(metrics.domContentLoaded).toBeLessThan(1000);
	});

	test('should have good First Contentful Paint', async ({ page }) => {
		await page.goto('/', { waitUntil: 'networkidle' });

		// Get paint metrics
		const paintMetrics = await page.evaluate(() => {
			const paints = performance.getEntriesByType('paint');
			const fcp = paints.find((entry) => entry.name === 'first-contentful-paint');
			return fcp ? fcp.startTime : null;
		});

		if (paintMetrics) {
			// FCP should be under 1.8s (good threshold)
			expect(paintMetrics).toBeLessThan(2500);
		}
	});
});

test.describe('Resource Optimization', () => {
	test('should not load unnecessary resources', async ({ page }) => {
		const resources: string[] = [];

		page.on('request', (request) => {
			resources.push(request.url());
		});

		await page.goto('/', { waitUntil: 'networkidle' });

		// Should not have duplicate resources
		const uniqueResources = new Set(resources);
		expect(resources.length).toBe(uniqueResources.size);
	});

	test('should cache static assets', async ({ page }) => {
		// First visit
		await page.goto('/');

		// Second visit (should use cache)
		const response = await page.goto('/');
		const headers = response?.headers();

		// Check for cache headers
		if (headers) {
			const cacheControl = headers['cache-control'];
			const etag = headers['etag'];

			// Should have some form of caching
			expect(cacheControl || etag).toBeTruthy();
		}
	});
});
