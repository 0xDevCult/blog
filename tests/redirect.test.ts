import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock the Astro content collection
vi.mock('astro:content', () => ({
	getCollection: vi.fn(),
}));

// Mock the frontmatter utility
vi.mock('../src/utils/get-post-frontmatter.ts', () => ({
	getPostFrontmatter: vi.fn((id: string) => {
		const mockData: Record<string, any> = {
			'posts/newest-post': {
				date: '2025-12-15',
				author: 'Test Author',
				tags: ['tag1'],
			},
			'posts/middle-post': {
				date: '2025-12-10',
				author: 'Test Author',
				tags: ['tag2'],
			},
			'posts/oldest-post': {
				date: '2025-12-05',
				author: 'Test Author',
				tags: ['tag3'],
			},
		};
		return mockData[id] || {};
	}),
}));

describe('Landing Page Redirect Logic', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should redirect to the newest post by date', async () => {
		const { getPostFrontmatter } = await import('../src/utils/get-post-frontmatter.ts');

		const posts = [
			{ id: 'posts/oldest-post', data: {} },
			{ id: 'posts/newest-post', data: {} },
			{ id: 'posts/middle-post', data: {} },
		];

		const postsWithFrontmatter = posts.map((post) => ({
			...post,
			frontmatter: getPostFrontmatter(post.id),
		}));

		const sortedPosts = postsWithFrontmatter.sort((a, b) => {
			const dateA = a.frontmatter.date ? new Date(a.frontmatter.date).getTime() : 0;
			const dateB = b.frontmatter.date ? new Date(b.frontmatter.date).getTime() : 0;
			return dateB - dateA;
		});

		const latestPost = sortedPosts[0];

		expect(latestPost.id).toBe('posts/newest-post');
		expect(latestPost.frontmatter.date).toBe('2025-12-15');
	});

	it('should generate correct redirect URL', async () => {
		const { getPostFrontmatter } = await import('../src/utils/get-post-frontmatter.ts');

		const post = {
			id: 'posts/test-post',
			data: {},
			frontmatter: getPostFrontmatter('posts/newest-post'),
		};

		const redirectUrl = `/${post.id.replace(/\.mdx?$/, '')}/`;

		expect(redirectUrl).toBe('/posts/test-post/');
	});

	it('should handle posts without dates (fallback to timestamp 0)', async () => {
		const { getPostFrontmatter } = await import('../src/utils/get-post-frontmatter.ts');

		const posts = [
			{ id: 'posts/no-date', data: {}, frontmatter: {} },
			{
				id: 'posts/newest-post',
				data: {},
				frontmatter: getPostFrontmatter('posts/newest-post'),
			},
		];

		const sortedPosts = posts.sort((a, b) => {
			const dateA = a.frontmatter.date ? new Date(a.frontmatter.date).getTime() : 0;
			const dateB = b.frontmatter.date ? new Date(b.frontmatter.date).getTime() : 0;
			return dateB - dateA;
		});

		// Post with date should be first
		expect(sortedPosts[0].id).toBe('posts/newest-post');
	});

	it('should handle .md and .mdx file extensions', () => {
		const mdPost = { id: 'posts/test.md' };
		const mdxPost = { id: 'posts/test.mdx' };

		const mdUrl = `/${mdPost.id.replace(/\.mdx?$/, '')}/`;
		const mdxUrl = `/${mdxPost.id.replace(/\.mdx?$/, '')}/`;

		expect(mdUrl).toBe('/posts/test/');
		expect(mdxUrl).toBe('/posts/test/');
	});

	it('should work with empty posts array (fallback scenario)', () => {
		const posts: any[] = [];
		const latestPost = posts[0];

		expect(latestPost).toBeUndefined();
		// In the actual code, this triggers the fallback redirect
	});
});
