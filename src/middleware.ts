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
  // In production, consider using nonces or hashes for better security
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline'", // Starlight uses inline scripts
    "style-src 'self' 'unsafe-inline'", // Starlight uses inline styles
    "img-src 'self' data: https:",
    "font-src 'self' data:",
    "connect-src 'self'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; ');

  newResponse.headers.set('Content-Security-Policy', csp);

  // Additional security headers
  newResponse.headers.set('X-Frame-Options', 'DENY');
  newResponse.headers.set('X-Content-Type-Options', 'nosniff');
  newResponse.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  newResponse.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  // HSTS (Strict-Transport-Security) - uncomment if using HTTPS
  // newResponse.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');

  return newResponse;
});
