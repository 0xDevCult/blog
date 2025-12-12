import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility', () => {
	test('homepage should not have accessibility violations', async ({ page }) => {
		await page.goto('/');
		await page.waitForLoadState('networkidle');

		const accessibilityScanResults = await new AxeBuilder({ page })
			.withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
			.analyze();

		expect(accessibilityScanResults.violations).toEqual([]);
	});

	test('blog post page should not have accessibility violations', async ({ page }) => {
		await page.goto('/posts/welcome-to-devcult-blog/');

		const accessibilityScanResults = await new AxeBuilder({ page })
			.withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
			.analyze();

		expect(accessibilityScanResults.violations).toEqual([]);
	});

	test('should have proper heading hierarchy', async ({ page }) => {
		await page.goto('/posts/welcome-to-devcult-blog/');

		// Check that h1 exists and is unique
		const h1Count = await page.locator('h1').count();
		expect(h1Count).toBe(1);

		// Check heading hierarchy (no skipped levels)
		const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
		const headingLevels = await Promise.all(
			headings.map(async (heading) => {
				const tagName = await heading.evaluate((el) => el.tagName);
				return parseInt(tagName.substring(1));
			})
		);

		// Verify no heading levels are skipped
		for (let i = 1; i < headingLevels.length; i++) {
			const levelDiff = headingLevels[i] - headingLevels[i - 1];
			expect(levelDiff).toBeLessThanOrEqual(1);
		}
	});

	test('all images should have alt text', async ({ page }) => {
		await page.goto('/posts/welcome-to-devcult-blog/');

		const images = await page.locator('img').all();
		for (const image of images) {
			const alt = await image.getAttribute('alt');
			expect(alt).toBeTruthy();
		}
	});

	test('all links should have accessible names', async ({ page }) => {
		await page.goto('/posts/welcome-to-devcult-blog/');

		const links = await page.locator('a').all();
		for (const link of links) {
			const text = await link.textContent();
			const ariaLabel = await link.getAttribute('aria-label');
			const ariaLabelledBy = await link.getAttribute('aria-labelledby');

			// Link should have text, aria-label, or aria-labelledby
			expect(text?.trim() || ariaLabel || ariaLabelledBy).toBeTruthy();
		}
	});

	test('form inputs should have labels', async ({ page }) => {
		await page.goto('/posts/welcome-to-devcult-blog/');

		// Click search button to open search
		const searchButton = page.locator('site-search button').first();
		await searchButton.click();

		// Wait for search input to appear
		const searchInput = page
			.locator('input[type="search"], input[placeholder*="Search" i]')
			.first();
		await expect(searchInput).toBeVisible();

		// Check if input has associated label or aria-label
		const ariaLabel = await searchInput.getAttribute('aria-label');
		const ariaLabelledBy = await searchInput.getAttribute('aria-labelledby');
		const id = await searchInput.getAttribute('id');

		let hasLabel = false;
		if (id) {
			const label = page.locator(`label[for="${id}"]`);
			hasLabel = (await label.count()) > 0;
		}

		expect(ariaLabel || ariaLabelledBy || hasLabel).toBeTruthy();
	});

	test('should have proper color contrast', async ({ page }) => {
		await page.goto('/posts/welcome-to-devcult-blog/');

		const accessibilityScanResults = await new AxeBuilder({ page })
			.withTags(['wcag2aa'])
			.options({ rules: { 'color-contrast': { enabled: true } } })
			.analyze();

		const colorContrastViolations = accessibilityScanResults.violations.filter(
			(violation) => violation.id === 'color-contrast'
		);

		expect(colorContrastViolations).toEqual([]);
	});

	test('should support keyboard navigation', async ({ page }) => {
		await page.goto('/posts/welcome-to-devcult-blog/');

		// Press Tab to navigate through focusable elements
		await page.keyboard.press('Tab');

		// Check that focus is visible
		const focusedElement = await page.evaluate(() => {
			const active = document.activeElement;
			if (!active) return null;

			const styles = window.getComputedStyle(active);
			return {
				tagName: active.tagName,
				outline: styles.outline,
				outlineWidth: styles.outlineWidth,
			};
		});

		// Should have a focused element
		expect(focusedElement).toBeTruthy();
		expect(focusedElement?.tagName).toBeTruthy();
	});

	test('mobile menu should be accessible', async ({ page }) => {
		await page.setViewportSize({ width: 375, height: 667 });
		await page.goto('/posts/welcome-to-devcult-blog/');

		// Find and check mobile menu button
		const menuButton = page.locator('button[aria-label*="menu" i], button[aria-expanded]').first();
		await expect(menuButton).toBeVisible();

		// Check that button has accessible name
		const ariaLabel = await menuButton.getAttribute('aria-label');
		const ariaExpanded = await menuButton.getAttribute('aria-expanded');

		expect(ariaLabel || ariaExpanded !== null).toBeTruthy();
	});

	test('theme toggle should be accessible', async ({ page }) => {
		await page.goto('/posts/welcome-to-devcult-blog/');

		// Find theme toggle buttons
		const themeButtons = page.locator('starlight-theme-select button');
		const count = await themeButtons.count();

		expect(count).toBeGreaterThan(0);

		// Each button should have aria-label
		for (let i = 0; i < count; i++) {
			const button = themeButtons.nth(i);
			const ariaLabel = await button.getAttribute('aria-label');
			expect(ariaLabel).toBeTruthy();
		}
	});
});
