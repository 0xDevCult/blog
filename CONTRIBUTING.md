# Contributing to DevCult Blog

Thank you for your interest in contributing to the DevCult blog! We welcome contributions from the community.

## How to Contribute

### Types of Contributions

We accept several types of contributions:

1. **Blog Posts** - Write new technical articles
2. **Improvements** - Enhance existing posts
3. **Bug Fixes** - Fix typos, broken links, or code errors
4. **Design** - Improve styling and user experience
5. **Documentation** - Help improve this README or guides

## Contribution Process

### 1. Before You Start

- Check [existing issues](https://github.com/0xDevCult/blog/issues) and [pull requests](https://github.com/0xDevCult/blog/pulls)
- For new blog post ideas, open an issue first to discuss
- For small fixes (typos, links), feel free to submit a PR directly

### 2. Fork and Clone

```bash
# Fork the repository on GitHub, then:
git clone https://github.com/YOUR_USERNAME/blog.git
cd blog

# Add upstream remote
git remote add upstream https://github.com/0xDevCult/blog.git
```

### 3. Create a Branch

```bash
# For blog posts
git checkout -b post/your-post-title

# For bug fixes
git checkout -b fix/description

# For features
git checkout -b feature/description
```

### 4. Make Your Changes

Follow our [style guide](#style-guide) and [technical requirements](#technical-requirements).

### 5. Test Locally

```bash
npm install
npm run dev
```

Visit `http://localhost:4321` and verify:

- Your post renders correctly
- Images load properly
- Code examples display with syntax highlighting
- Links work
- Content is readable on mobile

### 6. Commit Your Changes

```bash
git add .
git commit -m "Add post: Your Post Title"

# Use conventional commits:
# - "Add post: [title]" for new posts
# - "Fix: [description]" for bug fixes
# - "Update: [description]" for improvements
# - "Docs: [description]" for documentation
```

### 7. Push and Create Pull Request

```bash
git push origin your-branch-name
```

Go to GitHub and create a Pull Request with:

- Clear title describing the change
- Description of what you changed and why
- Screenshots (if visual changes)
- Reference to related issues (if applicable)

### 8. Code Review

- A maintainer will review your PR
- Address any feedback or requested changes
- Once approved, your PR will be merged

## Style Guide

### Writing Style

✅ **Do:**

- Write in clear, concise language
- Use active voice
- Start with practical examples
- Include working code snippets
- Make content scannable with headings
- Provide actionable takeaways

❌ **Don't:**

- Write overly academic or verbose content
- Assume extensive prior knowledge
- Include code that doesn't work
- Use jargon without explanation

### Code Examples

All code must be:

- **Tested** and working
- **Complete** (include imports)
- **Commented** when needed
- **Syntax-highlighted** with correct language tags

**Good:**

````markdown
```typescript
import { createUser } from './auth';

// Create a new user with validation
const user = await createUser({
	email: 'alice@example.com',
	password: 'secure123',
});

console.log(user.id); // Output: "user_abc123"
```
````

**Bad:**

````markdown
```
createUser(email, password)
```
````

### Formatting Standards

**Headings:**

- Use sentence case
- H1 for title (automatic from frontmatter)
- H2 for main sections
- H3 for subsections
- H4 for minor subsections

**Lists:**

- Use bullet points for unordered items
- Use numbers for sequential steps
- Keep list items parallel in structure

**Links:**

- Use descriptive link text (not "click here")
- Prefer HTTPS
- Test all external links

**Images:**

- Include descriptive alt text
- Optimize for web (WebP preferred)
- Place in `src/assets/` or `public/`
- Max width: 1200px

## Technical Requirements

### Frontmatter

Every blog post must include:

```yaml
---
title: Descriptive Title (50-60 characters)
description: Compelling one-line summary (150-160 characters)
date: YYYY-MM-DD
author: Your Name
tags:
  - category1
  - category2
  - category3
---
```

### File Naming

- Use kebab-case: `my-awesome-post.md`
- Be descriptive but concise
- Avoid dates in filenames

### Content Structure

A well-structured post includes:

1. **Introduction** (1-2 paragraphs)
   - What the post covers
   - Why it matters
   - What readers will learn

2. **Main Content** (organized sections)
   - Clear headings
   - Code examples
   - Explanations
   - Practical applications

3. **Conclusion**
   - Key takeaways
   - Next steps
   - Call to action

4. **Footer** (optional)
   - Related resources
   - Contact information

### SEO Best Practices

- Use descriptive, keyword-rich titles
- Write compelling meta descriptions
- Include relevant tags (3-5 per post)
- Use descriptive headings (H2, H3)
- Add alt text to all images
- Include internal links to related posts

## Content Guidelines

### Topics We Cover

✅ **Great topics:**

- Developer experience best practices
- DevRel strategies and tactics
- Technical tutorials and how-tos
- Open source project management
- Documentation and technical writing
- Developer tools and workflows
- API design and architecture
- Community building

❌ **Off-topic:**

- Pure marketing or sales content
- Unrelated to developer experience
- Duplicate content from elsewhere
- Opinion pieces without practical value

### Content Quality Standards

Your post should:

- Provide unique value or perspective
- Be original content (not copied)
- Be technically accurate
- Include practical examples
- Be at least 800 words (for in-depth posts)
- Be well-edited and proofread

### Code of Conduct

- Be respectful and inclusive
- Use welcoming language
- Avoid inflammatory content
- No harassment or discrimination
- Focus on constructive feedback

## Review Process

### What We Look For

1. **Technical Accuracy**
   - Code examples work
   - Information is correct
   - Links are valid

2. **Writing Quality**
   - Clear and concise
   - Well-structured
   - Properly edited

3. **Design Consistency**
   - Follows brand guidelines
   - Proper formatting
   - Good visual hierarchy

4. **SEO Optimization**
   - Good title and description
   - Appropriate tags
   - Internal linking

### Timeline

- Initial review: 1-3 business days
- Feedback/revisions: As needed
- Final approval: 1-2 business days
- Publication: Immediately after merge

## Questions?

- 💬 Open an [issue](https://github.com/0xDevCult/blog/issues)
- 📧 Email us at [info@devcult.io](mailto:info@devcult.io)
- 🐦 Tweet at [@0xDevCult](https://x.com/0xDevCult)

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
