import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

interface PostFrontmatter {
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
    console.error(`Failed to read frontmatter for ${postId}:`, error);
    return {};
  }
}
