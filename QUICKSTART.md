# Quick Start Guide

Get the DevCult blog running locally in under 5 minutes.

## Prerequisites

- Node.js 18 or higher
- npm (comes with Node.js)

## Installation

```bash
# 1. Clone the repository
git clone https://github.com/0xDevCult/blog.git
cd blog

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

Open http://localhost:4321 in your browser. You should see the DevCult blog!

## Your First Blog Post

Create a new file in `src/content/docs/posts/`:

```bash
# Create the file
touch src/content/docs/posts/my-first-post.md
```

Add this content:

````markdown
---
title: My First Blog Post
description: Learning how to write blog posts for DevCult
date: 2025-11-14
author: Your Name
tags:
  - tutorial
  - getting-started
---

# My First Post

This is my first blog post on the DevCult blog!

## Code Example

\```typescript
const greeting = "Hello, DevCult!";
console.log(greeting);
\```

## What I Learned

- How to create a blog post
- Using frontmatter
- Adding code examples
````

Save the file and check http://localhost:4321/posts/my-first-post/ - your post is live!

## Next Steps

- Read the full [README.md](./README.md)
- Check [CONTRIBUTING.md](./CONTRIBUTING.md) for writing guidelines
- See [DEPLOYMENT.md](./DEPLOYMENT.md) to deploy to production
