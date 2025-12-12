import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

export interface PostFrontmatter {
	title?: string;
	description?: string;
	date?: string;
	author?: string;
	tags?: string[];
}

const postsCache = new Map<string, PostFrontmatter>();

export function getPostFrontmatter(postId: string): PostFrontmatter {
	if (postsCache.has(postId)) {
		return postsCache.get(postId)!;
	}

	try {
		const filePath = path.join(process.cwd(), 'src', 'content', 'docs', `${postId}.md`);
		const fileContents = fs.readFileSync(filePath, 'utf8');
		const { data } = matter(fileContents);

		const frontmatter: PostFrontmatter = {
			date: data.date,
			author: data.author,
			tags: data.tags,
		};

		postsCache.set(postId, frontmatter);
		return frontmatter;
	} catch (error) {
		// Return empty object if file cannot be read (e.g., file doesn't exist)
		return {};
	}
}
