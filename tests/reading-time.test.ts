import { describe, it, expect } from 'vitest';
import { calculateReadingTime, formatReadingTime, getReadingTime } from '../src/utils/reading-time';

describe('calculateReadingTime', () => {
	it('should calculate reading time correctly', () => {
		const text = 'word '.repeat(200); // 200 words
		expect(calculateReadingTime(text)).toBe(1);
	});

	it('should round up to nearest minute', () => {
		const text = 'word '.repeat(250); // 250 words, should be 2 minutes at 200 wpm
		expect(calculateReadingTime(text)).toBe(2);
	});

	it('should handle empty string', () => {
		expect(calculateReadingTime('')).toBe(0);
	});

	it('should handle whitespace-only string', () => {
		expect(calculateReadingTime('   \n\t  ')).toBe(0);
	});

	it('should strip HTML tags', () => {
		const html = '<p>' + 'word '.repeat(200) + '</p><div>more words</div>';
		const result = calculateReadingTime(html);
		expect(result).toBeGreaterThan(0);
	});

	it('should respect custom words per minute', () => {
		const text = 'word '.repeat(400); // 400 words
		expect(calculateReadingTime(text, 400)).toBe(1); // At 400 wpm, should be 1 minute
		expect(calculateReadingTime(text, 200)).toBe(2); // At 200 wpm, should be 2 minutes
	});

	it('should handle multiple spaces between words', () => {
		const text = 'word    word    word    word';
		expect(calculateReadingTime(text)).toBe(1); // 4 words, rounds up to 1
	});

	it('should handle text with newlines', () => {
		const text = 'word\nword\nword\n' + 'word '.repeat(197); // 200 words total
		expect(calculateReadingTime(text)).toBe(1);
	});
});

describe('formatReadingTime', () => {
	it('should format single minute', () => {
		expect(formatReadingTime(1)).toBe('1 min read');
	});

	it('should format multiple minutes', () => {
		expect(formatReadingTime(5)).toBe('5 min read');
	});

	it('should handle less than 1 minute', () => {
		expect(formatReadingTime(0)).toBe('Less than 1 min read');
	});

	it('should handle negative values gracefully', () => {
		expect(formatReadingTime(-1)).toBe('Less than 1 min read');
	});
});

describe('getReadingTime', () => {
	it('should return both minutes and formatted text', () => {
		const text = 'word '.repeat(400); // 400 words = 2 minutes at 200 wpm
		const result = getReadingTime(text);

		expect(result).toHaveProperty('minutes');
		expect(result).toHaveProperty('text');
		expect(result.minutes).toBe(2);
		expect(result.text).toBe('2 min read');
	});

	it('should work with markdown content', () => {
		const markdown = `
# Heading

This is a paragraph with **bold** and *italic* text.

## Another heading

- List item 1
- List item 2

${'word '.repeat(200)}
    `;

		const result = getReadingTime(markdown);
		expect(result.minutes).toBeGreaterThan(0);
		expect(result.text).toContain('min read');
	});

	it('should handle empty markdown', () => {
		const result = getReadingTime('');
		expect(result.minutes).toBe(0);
		expect(result.text).toBe('Less than 1 min read');
	});
});
