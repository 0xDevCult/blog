import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { getPostFrontmatter } from "../utils/get-post-frontmatter.ts";

export async function GET(context) {
  const posts = await getCollection("docs", ({ id }) => {
    return id.startsWith("posts/");
  });

  // Enhance posts with frontmatter from markdown files
  const postsWithFrontmatter = posts.map((post) => {
    const frontmatter = getPostFrontmatter(post.id);
    return {
      ...post,
      frontmatter,
    };
  });

  // Sort posts by date (newest first)
  const sortedPosts = postsWithFrontmatter.sort((a, b) => {
    const dateA = a.frontmatter.date
      ? new Date(a.frontmatter.date).getTime()
      : 0;
    const dateB = b.frontmatter.date
      ? new Date(b.frontmatter.date).getTime()
      : 0;
    return dateB - dateA;
  });

  return rss({
    title: "DevCult Blog",
    description:
      "Technical insights, developer experience, and DevRel best practices from the DevCult team.",
    site: context.site,
    items: sortedPosts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.frontmatter.date
        ? new Date(post.frontmatter.date)
        : new Date(),
      author: post.frontmatter.author,
      link: `/${post.id.replace(/\.mdx?$/, "")}/`,
      categories: post.frontmatter.tags || [],
    })),
    customData: `<language>en-us</language>`,
  });
}
