import rss from "@astrojs/rss";
import { getCollection } from "astro:content";

export async function GET(context) {
  const posts = await getCollection("docs", ({ id }) => {
    return id.startsWith("posts/");
  });

  // Sort posts by date (newest first)
  const sortedPosts = posts.sort((a, b) => {
    const dateA = a.data.date ? new Date(a.data.date).getTime() : 0;
    const dateB = b.data.date ? new Date(b.data.date).getTime() : 0;
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
      pubDate: post.data.date ? new Date(post.data.date) : new Date(),
      author: post.data.author,
      link: `/${post.id.replace(".md", "").replace(".mdx", "")}/`,
      categories: post.data.tags || [],
    })),
    customData: `<language>en-us</language>`,
  });
}
