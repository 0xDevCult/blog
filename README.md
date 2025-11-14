# DevCult Blog

The official blog of DevCult - sharing technical insights, developer experience best practices, and DevRel strategies.

🌐 **Live Site:** [blog.devcult.io](https://blog.devcult.io)

## About

This blog is built with [Astro](https://astro.build) and [Starlight](https://starlight.astro.build), optimized for technical content, code examples, and developer-focused articles.

### Design System

The blog uses the same design system as [devcult.io](https://devcult.io):
- **Brand Color:** `#FF6A00` (orange)
- **Background:** Black with subtle brand glows
- **Typography:** System fonts with consistent weights
- **Style:** Modern, minimal, developer-focused

## Quick Start

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- Git

### Local Development

```bash
# Clone the repository
git clone https://github.com/0xDevCult/blog.git
cd blog

# Install dependencies
npm install

# Start the development server
npm run dev
```

The site will be available at `http://localhost:4321`

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build locally
npm run astro        # Run Astro CLI commands
```

## Contributing Blog Posts

We welcome contributions! Here's how to add a new blog post:

### 1. Create a New Post

Create a new Markdown file in `src/content/docs/posts/`:

```bash
src/content/docs/posts/your-post-title.md
```

### 2. Add Frontmatter

Every blog post needs frontmatter at the top:

```yaml
---
title: Your Post Title
description: A compelling description that will appear in search results and social shares.
date: 2025-11-14
author: Your Name
tags:
  - developer-experience
  - tutorial
  - best-practices
---
```

### 3. Write Your Content

Write your post using Markdown or MDX. You have access to:

#### Standard Markdown

```markdown
# Headings
## Subheadings

**Bold text** and *italic text*

- Bulleted lists
1. Numbered lists

[Links](https://example.com)

![Images](./image.png)
```

#### Code Blocks with Syntax Highlighting

````markdown
```typescript
const greeting: string = "Hello, DevCult!";
console.log(greeting);
```
````

#### Starlight Components

```markdown
import { Card, CardGrid, Aside, Tabs, TabItem } from '@astrojs/starlight/components';

<Aside type="tip">
  Helpful tips for readers!
</Aside>

<CardGrid>
  <Card title="Feature 1" icon="rocket">
    Description of feature 1
  </Card>
  <Card title="Feature 2" icon="star">
    Description of feature 2
  </Card>
</CardGrid>
```

### 4. Preview Your Post

```bash
npm run dev
```

Navigate to `http://localhost:4321/posts/your-post-title/`

### 5. Submit Your Post

```bash
git checkout -b post/your-post-title
git add src/content/docs/posts/your-post-title.md
git commit -m "Add post: Your Post Title"
git push origin post/your-post-title
```

Then create a Pull Request on GitHub.

## Content Guidelines

### Writing Style

- **Clear and concise**: Respect the reader's time
- **Code-first**: Show examples before explaining theory
- **Practical**: Focus on actionable insights
- **Scannable**: Use headings, lists, and code blocks
- **Tested**: All code examples must work

### Technical Requirements

1. **Code Examples**
   - Must be tested and working
   - Include necessary imports
   - Show expected output
   - Use syntax highlighting

2. **Images**
   - Place in `src/assets/` or `public/`
   - Use descriptive alt text
   - Optimize for web (WebP preferred)
   - Max width: 1200px

3. **Links**
   - Use HTTPS
   - Test all external links
   - Use relative links for internal pages

4. **SEO**
   - Clear, descriptive title (50-60 characters)
   - Compelling description (150-160 characters)
   - Relevant tags (3-5 per post)
   - Descriptive headings (H2, H3)

### Post Structure Template

```markdown
---
title: Your Compelling Title
description: One-sentence summary that hooks readers.
date: YYYY-MM-DD
author: Your Name
tags:
  - category
  - topic
---

Brief introduction (1-2 paragraphs) that explains:
- What the post is about
- Why it matters
- What readers will learn

## Main Section 1

Content with code examples...

## Main Section 2

More content...

## Key Takeaways

- Bullet point summary
- Of main insights
- From the post

## Next Steps

What should readers do next?

---

*Questions? [Get in touch](https://devcult.io#contact)*
```

## Project Structure

```
blog/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Pages deployment
├── public/
│   ├── CNAME                   # Custom domain config
│   └── favicon.svg             # Site favicon
├── src/
│   ├── assets/
│   │   └── logo.svg            # DevCult logo
│   ├── content/
│   │   ├── docs/
│   │   │   ├── index.mdx       # Homepage
│   │   │   └── posts/          # Blog posts directory
│   │   └── config.ts           # Content collections config
│   └── styles/
│       └── custom.css          # Custom CSS (DevCult branding)
├── astro.config.mjs            # Astro configuration
├── package.json                # Dependencies
├── tsconfig.json               # TypeScript config
└── README.md                   # This file
```

## Deployment

### Automatic Deployment

The blog automatically deploys to GitHub Pages when you push to the `main` branch.

**Workflow:**
1. Push changes to `main`
2. GitHub Actions builds the site
3. Deploys to `blog.devcult.io`
4. Live in ~2 minutes

### Manual Deployment

You can trigger a manual deployment:

1. Go to Actions tab on GitHub
2. Select "Deploy to GitHub Pages"
3. Click "Run workflow"

### First-Time Setup

To enable GitHub Pages for this repository:

1. Go to repository Settings → Pages
2. Source: "GitHub Actions"
3. Custom domain: `blog.devcult.io`
4. Enforce HTTPS: ✓

DNS configuration for `blog.devcult.io`:
```
CNAME record: blog → 0xdevcult.github.io
```

## Configuration

### Site Configuration

Edit `astro.config.mjs` to customize:

- Site title and description
- Social links
- Navigation structure
- Theme settings

### Styling

The blog uses a custom CSS file that matches devcult.io's design system:

**File:** `src/styles/custom.css`

**Key variables:**
```css
--brand-500: #ff6a00;  /* Primary brand color */
--sl-color-accent: #ff6a00;  /* Link color */
--sl-color-bg: #000000;  /* Background */
```

### Adding New Pages

Create new pages in `src/content/docs/`:

```bash
src/content/docs/about.md
src/content/docs/archive.md
```

Update sidebar in `astro.config.mjs`:

```javascript
sidebar: [
  {
    label: 'Blog Posts',
    autogenerate: { directory: 'posts' },
  },
  {
    label: 'About',
    link: '/about/',
  },
],
```

## Maintenance

### Regular Tasks

- **Weekly**: Review and respond to comments/issues
- **Monthly**: Update dependencies (`npm update`)
- **Quarterly**: Audit content for accuracy
- **Annually**: Review and update older posts

### Updating Dependencies

```bash
# Check for updates
npm outdated

# Update all dependencies
npm update

# Update Astro specifically
npm install astro@latest @astrojs/starlight@latest
```

### Testing Before Deploy

Always test locally before pushing:

```bash
npm run build
npm run preview
```

Visit `http://localhost:4321` and verify:
- All pages load correctly
- Images display properly
- Links work
- Code examples render with syntax highlighting
- Search works
- Mobile responsive

## Troubleshooting

### Build Fails

**Error: "Cannot find module"**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Error: "ENOENT: no such file or directory"**
- Check file paths are correct
- Ensure images exist in `src/assets/` or `public/`

### Development Server Issues

**Port already in use:**
```bash
# Kill process on port 4321
lsof -ti:4321 | xargs kill -9

# Or use a different port
npm run dev -- --port 3000
```

**Changes not showing:**
- Hard refresh browser (Ctrl+Shift+R / Cmd+Shift+R)
- Clear browser cache
- Restart dev server

### Deployment Issues

**404 on custom domain:**
- Verify CNAME file exists in `public/CNAME`
- Check DNS settings point to GitHub Pages
- Wait up to 24 hours for DNS propagation

**Styles not loading:**
- Check `astro.config.mjs` has correct `site` URL
- Verify CSS file path in config
- Clear browser cache

## Resources

### Documentation

- [Astro Docs](https://docs.astro.build)
- [Starlight Docs](https://starlight.astro.build)
- [Markdown Guide](https://www.markdownguide.org/)
- [MDX Documentation](https://mdxjs.com/)

### Tools

- [Carbon](https://carbon.now.sh/) - Beautiful code screenshots
- [Excalidraw](https://excalidraw.com/) - Diagrams and illustrations
- [ImageOptim](https://imageoptim.com/) - Image optimization
- [Grammarly](https://grammarly.com/) - Writing assistance

### Inspiration

- [Astro Blog](https://astro.build/blog/)
- [Vercel Blog](https://vercel.com/blog)
- [Linear Blog](https://linear.app/blog)
- [Supabase Blog](https://supabase.com/blog)

## Support

### Questions or Issues?

- 🐛 [Report a bug](https://github.com/0xDevCult/blog/issues)
- 💡 [Request a feature](https://github.com/0xDevCult/blog/issues)
- 💬 [Join our community](https://devcult.io#contact)
- 📧 [Email us](mailto:info@devcult.io)

### Contributing

We welcome contributions! Please:

1. Check existing issues and PRs
2. Follow the writing style guide
3. Test your changes locally
4. Submit a clear PR description

See [CONTRIBUTING.md](./CONTRIBUTING.md) for details.

## License

MIT © DevCult

---

**Built with ❤️ by the DevCult team**

[Website](https://devcult.io) • [GitHub](https://github.com/0xDevCult) • [Twitter](https://x.com/0xDevCult) • [LinkedIn](https://linkedin.com/company/devcult)
