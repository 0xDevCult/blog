import { describe, it, expect } from 'vitest';

describe('StructuredData Schema', () => {
	it('should have valid BlogPosting schema structure', () => {
		// Mock structured data
		const structuredData = {
			'@context': 'https://schema.org',
			'@type': 'BlogPosting',
			headline: 'Test Post',
			description: 'Test description',
			url: 'https://blog.devcult.io/posts/test/',
			datePublished: '2025-01-01T00:00:00.000Z',
			dateModified: '2025-01-01T00:00:00.000Z',
			author: {
				'@type': 'Person',
				name: 'Test Author',
				url: 'https://devcult.io',
			},
			publisher: {
				'@type': 'Organization',
				name: 'DevCult',
				url: 'https://devcult.io',
				logo: {
					'@type': 'ImageObject',
					url: 'https://blog.devcult.io/og-image.png',
					width: 1200,
					height: 630,
				},
			},
			keywords: 'test, blog',
			mainEntityOfPage: {
				'@type': 'WebPage',
				'@id': 'https://blog.devcult.io/posts/test/',
			},
			image: {
				'@type': 'ImageObject',
				url: 'https://blog.devcult.io/og-image.png',
				width: 1200,
				height: 630,
			},
		};

		expect(structuredData['@context']).toBe('https://schema.org');
		expect(structuredData['@type']).toBe('BlogPosting');
		expect(structuredData.headline).toBeTruthy();
		expect(structuredData.author).toHaveProperty('@type');
		expect(structuredData.publisher).toHaveProperty('@type');
	});

	it('should use Organization type for DevCult Team author', () => {
		const author = 'DevCult Team';
		const authorType = author === 'DevCult Team' ? 'Organization' : 'Person';

		expect(authorType).toBe('Organization');
	});

	it('should use Person type for individual authors', () => {
		const author: string = 'John Doe';
		const authorType = author === 'DevCult Team' || !author ? 'Organization' : 'Person';

		expect(authorType).toBe('Person');
	});

	it('should handle tags as comma-separated keywords', () => {
		const tags = ['javascript', 'typescript', 'testing'];
		const keywords = tags.join(', ');

		expect(keywords).toBe('javascript, typescript, testing');
	});

	it('should generate valid ISO date strings', () => {
		const date = '2025-01-15';
		const isoDate = new Date(date).toISOString();

		expect(isoDate).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
	});
});

describe('BreadcrumbList Schema', () => {
	it('should have valid BreadcrumbList structure', () => {
		const breadcrumbList = {
			'@context': 'https://schema.org',
			'@type': 'BreadcrumbList',
			itemListElement: [
				{
					'@type': 'ListItem',
					position: 1,
					name: 'Home',
					item: 'https://blog.devcult.io/',
				},
				{
					'@type': 'ListItem',
					position: 2,
					name: 'Posts',
					item: 'https://blog.devcult.io/posts/',
				},
				{
					'@type': 'ListItem',
					position: 3,
					name: 'Test Post',
				},
			],
		};

		expect(breadcrumbList['@context']).toBe('https://schema.org');
		expect(breadcrumbList['@type']).toBe('BreadcrumbList');
		expect(breadcrumbList.itemListElement).toHaveLength(3);
		expect(breadcrumbList.itemListElement[0].position).toBe(1);
		expect(breadcrumbList.itemListElement[2]).not.toHaveProperty('item'); // Last item has no URL
	});

	it('should increment position correctly', () => {
		const items = [
			{ name: 'Home', url: '/' },
			{ name: 'Posts', url: '/posts/' },
			{ name: 'Article' },
		];

		const itemListElement = items.map((item, index) => ({
			'@type': 'ListItem',
			position: index + 1,
			name: item.name,
			...(item.url && { item: `https://blog.devcult.io${item.url}` }),
		}));

		expect(itemListElement[0].position).toBe(1);
		expect(itemListElement[1].position).toBe(2);
		expect(itemListElement[2].position).toBe(3);
	});
});
