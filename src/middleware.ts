/**
 * Middleware for adding security headers
 *
 * Adds Content Security Policy and other security headers
 * to all responses from the Astro site
 */

import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async (context, next) => {
	const response = await next();

	// Clone the response to modify headers
	const newResponse = response.clone();

	// Content Security Policy
	// Note: 'unsafe-inline' is needed for Starlight's inline styles and scripts
	// TODO: Replace with nonces for better security
	const csp = [
		"default-src 'self'",
		"script-src 'self' 'unsafe-inline' https://plausible.io", // Starlight + Plausible Analytics
		"style-src 'self' 'unsafe-inline'", // Starlight uses inline styles
		"img-src 'self' data: https:",
		"font-src 'self' data:",
		"connect-src 'self' https://plausible.io", // Allow analytics requests
		"frame-ancestors 'none'",
		"base-uri 'self'",
		"form-action 'self'",
		'upgrade-insecure-requests',
		// Report violations in report-only mode (optional)
		// Uncomment and configure when you have a CSP reporting endpoint
		// "report-uri /csp-report",
	].join('; ');

	newResponse.headers.set('Content-Security-Policy', csp);

	// Additional security headers
	newResponse.headers.set('X-Frame-Options', 'DENY');
	newResponse.headers.set('X-Content-Type-Options', 'nosniff');
	newResponse.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
	newResponse.headers.set('X-Permitted-Cross-Domain-Policies', 'none');
	newResponse.headers.set('Cross-Origin-Embedder-Policy', 'require-corp');
	newResponse.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
	newResponse.headers.set('Cross-Origin-Resource-Policy', 'same-origin');

	// Expanded Permissions Policy
	newResponse.headers.set(
		'Permissions-Policy',
		'camera=(), microphone=(), geolocation=(), payment=(), usb=(), ' +
			'magnetometer=(), gyroscope=(), accelerometer=()'
	);

	// HSTS (Strict-Transport-Security) for HTTPS enforcement
	// Enabled for GitHub Pages (serves over HTTPS)
	newResponse.headers.set(
		'Strict-Transport-Security',
		'max-age=63072000; includeSubDomains; preload'
	);

	return newResponse;
});
