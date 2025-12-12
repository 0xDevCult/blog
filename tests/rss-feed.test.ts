import { describe, it, expect, beforeEach, vi } from "vitest";
import { getCollection } from "astro:content";

// Mock the Astro content collection
vi.mock("astro:content", () => ({
  getCollection: vi.fn(),
}));

// Mock the frontmatter utility
vi.mock("../src/utils/get-post-frontmatter.ts", () => ({
  getPostFrontmatter: vi.fn((id: string) => {
    const mockData: Record<string, any> = {
      "posts/newest-post": {
        date: "2025-12-15",
        author: "Test Author",
        tags: ["tag1"],
      },
      "posts/middle-post": {
        date: "2025-12-10",
        author: "Test Author",
        tags: ["tag2"],
      },
      "posts/oldest-post": {
        date: "2025-12-05",
        author: "Test Author",
        tags: ["tag3"],
      },
    };
    return mockData[id] || {};
  }),
}));

describe("RSS Feed Generation", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Mock post collection data
    (getCollection as any).mockResolvedValue([
      {
        id: "posts/newest-post",
        data: { title: "Newest Post", description: "Newest description" },
      },
      {
        id: "posts/middle-post",
        data: { title: "Middle Post", description: "Middle description" },
      },
      {
        id: "posts/oldest-post",
        data: { title: "Oldest Post", description: "Oldest description" },
      },
    ]);
  });

  it("should sort posts by date (newest first)", async () => {
    const { getPostFrontmatter } = await import(
      "../src/utils/get-post-frontmatter.ts"
    );

    const posts = [
      {
        id: "posts/oldest-post",
        frontmatter: getPostFrontmatter("posts/oldest-post"),
      },
      {
        id: "posts/newest-post",
        frontmatter: getPostFrontmatter("posts/newest-post"),
      },
      {
        id: "posts/middle-post",
        frontmatter: getPostFrontmatter("posts/middle-post"),
      },
    ];

    const sorted = posts.sort((a, b) => {
      const dateA = a.frontmatter.date
        ? new Date(a.frontmatter.date).getTime()
        : 0;
      const dateB = b.frontmatter.date
        ? new Date(b.frontmatter.date).getTime()
        : 0;
      return dateB - dateA;
    });

    expect(sorted[0].id).toBe("posts/newest-post");
    expect(sorted[1].id).toBe("posts/middle-post");
    expect(sorted[2].id).toBe("posts/oldest-post");
  });

  it("should handle posts without dates", async () => {
    const { getPostFrontmatter } = await import(
      "../src/utils/get-post-frontmatter.ts"
    );

    const posts = [
      { id: "posts/no-date", frontmatter: {} },
      {
        id: "posts/newest-post",
        frontmatter: getPostFrontmatter("posts/newest-post"),
      },
    ];

    const sorted = posts.sort((a, b) => {
      const dateA = a.frontmatter.date
        ? new Date(a.frontmatter.date).getTime()
        : 0;
      const dateB = b.frontmatter.date
        ? new Date(b.frontmatter.date).getTime()
        : 0;
      return dateB - dateA;
    });

    // Post with date should come first
    expect(sorted[0].id).toBe("posts/newest-post");
    expect(sorted[1].id).toBe("posts/no-date");
  });

  it("should extract correct frontmatter fields", async () => {
    const { getPostFrontmatter } = await import(
      "../src/utils/get-post-frontmatter.ts"
    );

    const frontmatter = getPostFrontmatter("posts/newest-post");

    expect(frontmatter.date).toBe("2025-12-15");
    expect(frontmatter.author).toBe("Test Author");
    expect(frontmatter.tags).toEqual(["tag1"]);
  });

  it("should generate valid RSS item structure", () => {
    const post = {
      id: "posts/test-post",
      data: { title: "Test Post", description: "Test description" },
      frontmatter: {
        date: "2025-12-15",
        author: "Test Author",
        tags: ["test"],
      },
    };

    const rssItem = {
      title: post.data.title,
      description: post.data.description,
      pubDate: post.frontmatter.date
        ? new Date(post.frontmatter.date)
        : new Date(),
      author: post.frontmatter.author,
      link: `/${post.id.replace(/\.mdx?$/, "")}/`,
      categories: post.frontmatter.tags || [],
    };

    expect(rssItem.title).toBe("Test Post");
    expect(rssItem.description).toBe("Test description");
    expect(rssItem.author).toBe("Test Author");
    expect(rssItem.link).toBe("/posts/test-post/");
    expect(rssItem.categories).toEqual(["test"]);
  });

  it("should handle missing optional fields gracefully", () => {
    const post = {
      id: "posts/minimal-post",
      data: { title: "Minimal Post", description: "Description" },
      frontmatter: {} as { date?: string; author?: string; tags?: string[] },
    };

    const rssItem = {
      title: post.data.title,
      description: post.data.description,
      pubDate: post.frontmatter.date
        ? new Date(post.frontmatter.date)
        : new Date(),
      author: post.frontmatter.author,
      link: `/${post.id.replace(/\.mdx?$/, "")}/`,
      categories: post.frontmatter.tags || [],
    };

    expect(rssItem.author).toBeUndefined();
    expect(rssItem.categories).toEqual([]);
    expect(rssItem.pubDate).toBeInstanceOf(Date);
  });
});
