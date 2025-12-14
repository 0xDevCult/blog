# Deployment Guide

This guide walks you through deploying the DevCult blog to GitHub Pages with the custom domain `blog.devcult.io`.

## Prerequisites

- GitHub repository: `0xDevCult/blog`
- Domain: `devcult.io` with DNS access
- GitHub account with push access to the repository

## Initial Setup

### 1. Push Code to GitHub

```bash
# Initialize git if not already done
git init
git add .
git commit -m "Initial commit: DevCult blog setup"

# Add remote and push
git remote add origin https://github.com/0xDevCult/blog.git
git branch -M main
git push -u origin main
```

### 2. Configure GitHub Pages

1. Go to your repository on GitHub: `https://github.com/0xDevCult/blog`
2. Navigate to **Settings** → **Pages**
3. Under **Source**, select: **GitHub Actions**
4. Under **Custom domain**, enter: `blog.devcult.io`
5. Check **Enforce HTTPS** (after DNS is configured)

### 3. Configure DNS

Add a CNAME record to your DNS provider for `devcult.io`:

```
Type:  CNAME
Name:  blog
Value: 0xdevcult.github.io
TTL:   3600 (or automatic)
```

**DNS Providers:**

- **Cloudflare**: DNS → Add record → CNAME
- **Namecheap**: Domain List → Manage → Advanced DNS
- **Google Domains**: DNS → Custom records
- **Route 53**: Hosted zones → Create record

**Verification:**
```bash
# Check DNS propagation (may take up to 24 hours)
dig blog.devcult.io

# Or use online tool
# https://dnschecker.org/#CNAME/blog.devcult.io
```

### 4. Trigger Deployment

The GitHub Actions workflow will automatically run when you push to `main`:

```bash
git push origin main
```

Or trigger manually:
1. Go to **Actions** tab on GitHub
2. Select **Deploy to GitHub Pages** workflow
3. Click **Run workflow** → **Run workflow**

### 5. Verify Deployment

After 2-5 minutes, visit:
- https://blog.devcult.io

You should see the DevCult blog homepage.

## Continuous Deployment

Every push to `main` automatically triggers a deployment:

```bash
# Make changes
git add .
git commit -m "Add new blog post"
git push origin main

# Wait 2-5 minutes, then check https://blog.devcult.io
```

## Workflow Details

The deployment workflow (`.github/workflows/deploy.yml`) performs these steps:

1. **Checkout code** from the repository
2. **Setup Node.js** (version 20)
3. **Install dependencies** (`npm ci`)
4. **Build the site** (`npm run build`)
5. **Upload artifact** (the `dist/` folder)
6. **Deploy to GitHub Pages**

## Troubleshooting

### Build Fails

**Check the Actions log:**
1. Go to **Actions** tab on GitHub
2. Click on the failed workflow run
3. Expand the failed step to see error details

**Common issues:**

- **Syntax errors**: Check your markdown files
- **Missing dependencies**: Run `npm install` locally first
- **TypeScript errors**: Run `npm run build` locally to catch errors

### 404 on Custom Domain

**Causes:**
- DNS not propagated yet (wait up to 24 hours)
- CNAME file missing (should be in `public/CNAME`)
- GitHub Pages not configured correctly

**Fixes:**
```bash
# Verify CNAME file exists
cat public/CNAME
# Should output: blog.devcult.io

# Check DNS
dig blog.devcult.io
# Should show CNAME pointing to 0xdevcult.github.io
```

### Styles Not Loading

**Causes:**
- Incorrect `site` URL in `astro.config.mjs`
- CSS file path wrong

**Fixes:**
```bash
# Verify config
grep "site:" astro.config.mjs
# Should show: site: 'https://blog.devcult.io',

# Rebuild
npm run build
git add .
git commit -m "Fix site URL"
git push origin main
```

### Images Not Displaying

**Causes:**
- Images in wrong directory
- Incorrect image paths

**Fixes:**
- Place images in `src/assets/` or `public/`
- Use correct relative paths in markdown
- Run `npm run build` locally to test

## Manual Deployment (Alternative)

If you need to deploy manually without GitHub Actions:

```bash
# Build locally
npm run build

# The output is in dist/
# Upload dist/ contents to your hosting provider
```

## Monitoring

### Check Deployment Status

```bash
# View recent deployments
gh run list --workflow=deploy.yml

# View specific run details
gh run view [RUN_ID]
```

Or visit: https://github.com/0xDevCult/blog/actions

### Analytics (Optional)

To add analytics:

1. **Umami** (privacy-friendly, recommended)
   - Add script to `head` in `astro.config.mjs`

2. **Google Analytics**
   - Add tracking code to `head` in `astro.config.mjs`

3. **PostHog** (product analytics)
   - Install and configure in Astro

## Security

### Branch Protection

Protect your `main` branch:

1. Go to **Settings** → **Branches**
2. Add rule for `main`
3. Enable:
   - Require pull request reviews
   - Require status checks to pass
   - Require conversation resolution

### Secrets Management

Never commit:
- API keys
- Passwords
- Private tokens

Use GitHub Secrets for sensitive data:
1. **Settings** → **Secrets and variables** → **Actions**
2. Add secrets as needed
3. Reference in workflow: `${{ secrets.SECRET_NAME }}`

## Rollback

To rollback to a previous version:

```bash
# View commit history
git log --oneline

# Revert to specific commit
git revert [COMMIT_HASH]
git push origin main

# Or reset (destructive)
git reset --hard [COMMIT_HASH]
git push origin main --force
```

## Performance

### Optimization Tips

1. **Image optimization**: Already enabled with Sharp
2. **Minimize CSS**: Automatically handled by Astro
3. **Code splitting**: Automatic with Astro
4. **CDN**: Use Cloudflare for DNS + CDN

### Monitoring Performance

Use tools like:
- [Google PageSpeed Insights](https://pagespeed.web.dev/)
- [WebPageTest](https://www.webpagetest.org/)
- [GTmetrix](https://gtmetrix.com/)

Target metrics:
- LCP (Largest Contentful Paint): < 2.5s
- FID (First Input Delay): < 100ms
- CLS (Cumulative Layout Shift): < 0.1
