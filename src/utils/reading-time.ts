/**
 * Calculate reading time for a given text
 *
 * @param text - The text content to analyze
 * @param wordsPerMinute - Average reading speed (default: 200 words per minute)
 * @returns Reading time in minutes
 */
export function calculateReadingTime(text: string, wordsPerMinute: number = 200): number {
	if (!text || text.trim().length === 0) {
		return 0;
	}

	// Remove HTML tags if present
	const plainText = text.replace(/<[^>]*>/g, '');

	// Count words (split by whitespace and filter empty strings)
	const wordCount = plainText
		.trim()
		.split(/\s+/)
		.filter((word) => word.length > 0).length;

	// Calculate reading time and round up to nearest minute
	const minutes = Math.ceil(wordCount / wordsPerMinute);

	return minutes;
}

/**
 * Format reading time as a human-readable string
 *
 * @param minutes - Reading time in minutes
 * @returns Formatted string like "5 min read" or "1 min read"
 */
export function formatReadingTime(minutes: number): string {
	if (minutes < 1) {
		return 'Less than 1 min read';
	}

	return `${minutes} min read`;
}

/**
 * Get reading time from markdown content
 *
 * @param markdown - The markdown content
 * @param wordsPerMinute - Average reading speed (default: 200)
 * @returns Object with minutes and formatted string
 */
export function getReadingTime(
	markdown: string,
	wordsPerMinute: number = 200
): {
	minutes: number;
	text: string;
} {
	const minutes = calculateReadingTime(markdown, wordsPerMinute);
	const text = formatReadingTime(minutes);

	return { minutes, text };
}
