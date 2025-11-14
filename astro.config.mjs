// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

// https://astro.build/config
export default defineConfig({
  site: "https://blog.devcult.io",
  title: "DevCult Blog",
  description:
    "Technical insights, developer experience, and DevRel best practices from the DevCult team.",
  logo: {
    src: "./src/assets/logo.svg",
    replacesTitle: false,
  },
  social: [
    { icon: "github", label: "GitHub", href: "https://github.com/0xDevCult" },
    { icon: "x.com", label: "X / Twitter", href: "https://x.com/0xDevCult" },
    {
      icon: "linkedin",
      label: "LinkedIn",
      href: "https://linkedin.com/company/devcult",
    },
  ],
  customCss: ["./src/styles/custom.css"],
  label: "Blog Posts",
  autogenerate: { directory: "posts" },
  components: {
    // Override default components if needed
    // Head: './src/components/Head.astro',
  },
  defaultLocale: "root",
  locales: {
    root: {
      label: "English",
      lang: "en",
    },
  },
  editLink: {
    baseUrl: "https://github.com/0xDevCult/blog/edit/main/",
  },
  lastUpdated: true,
  pagination: true,
  favicon: "/favicon.svg",
  head: [
    {
      tag: "meta",
      attrs: {
        property: "og:image",
        content: "https://blog.devcult.io/og-image.png",
      },
    },
    {
      tag: "meta",
      attrs: {
        name: "theme-color",
        content: "#ff6a00",
      },
    },
    {
      tag: "link",
      attrs: {
        rel: "alternate",
        type: "application/rss+xml",
        title: "DevCult Blog RSS Feed",
        href: "/rss.xml",
      },
    },
  ],
  // Enable search
  search: {
    provider: "pagefind",
  },
  // Disable table of contents on certain pages
  tableOfContents: {
    minHeadingLevel: 2,
    maxHeadingLevel: 4,
  },
  // Expressivity
  expressiveCode: {
    themes: ["github-dark", "github-light"],
    styleOverrides: {
      borderRadius: "0.75rem",
      borderColor: "rgba(255, 255, 255, 0.1)",
    },
  },
});
