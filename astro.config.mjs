// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// Environment variables with fallbacks
// Use different URLs for dev vs production
const isDev = process.env.NODE_ENV === 'development';
const SITE_URL =
	process.env.PUBLIC_SITE_URL || (isDev ? 'http://localhost:4321' : 'https://blog.devcult.io');
const GITHUB_ORG = process.env.GITHUB_ORG || '0xDevCult';
const GITHUB_REPO = process.env.GITHUB_REPO || 'blog';
const GITHUB_EDIT_BRANCH = process.env.GITHUB_EDIT_BRANCH || 'main';
const SOCIAL_GITHUB = process.env.SOCIAL_GITHUB || 'https://github.com/0xDevCult';
const SOCIAL_TWITTER = process.env.SOCIAL_TWITTER || 'https://x.com/0xDevCult';
const SOCIAL_LINKEDIN = process.env.SOCIAL_LINKEDIN || 'https://linkedin.com/company/devcult';

// https://astro.build/config
export default defineConfig({
	site: SITE_URL,
	image: {
		service: {
			entrypoint: 'astro/assets/services/sharp',
		},
	},
	vite: {
		plugins: [tailwindcss()],
	},
	integrations: [
		sitemap(),
		starlight({
			title: 'DevCult Blog',
			description:
				'Technical insights, developer experience, and DevRel best practices from the DevCult team.',
			logo: {
				src: './src/assets/logo.svg',
				replacesTitle: false,
			},
			components: {
				Sidebar: './src/components/overrides/Sidebar.astro',
				Header: './src/components/overrides/Header.astro',
				Head: './src/components/overrides/Head.astro',
				ThemeSelect: './src/components/overrides/ThemeSelect.astro',
				MobileMenuFooter: './src/components/overrides/MobileMenuFooter.astro',
				TableOfContents: './src/components/overrides/TableOfContents.astro',
				PageSidebar: './src/components/overrides/PageSidebar.astro',
				PageFrame: './src/components/overrides/PageFrame.astro',
			},
			social: [
				{ icon: 'github', label: 'GitHub', href: SOCIAL_GITHUB },
				{ icon: 'x.com', label: 'X / Twitter', href: SOCIAL_TWITTER },
				{ icon: 'linkedin', label: 'LinkedIn', href: SOCIAL_LINKEDIN },
			],
			customCss: ['./src/styles/custom.css'],
			sidebar: [
				{
					label: 'Blog Posts',
					autogenerate: { directory: 'posts' },
				},
			],
			defaultLocale: 'root',
			locales: {
				root: {
					label: 'English',
					lang: 'en',
				},
			},
			editLink: {
				baseUrl: `https://github.com/${GITHUB_ORG}/${GITHUB_REPO}/edit/${GITHUB_EDIT_BRANCH}/`,
			},
			lastUpdated: true,
			pagination: true,
			favicon: '/favicon.svg',
			head: [
				// Preload critical fonts for better performance (LCP)
				{
					tag: 'link',
					attrs: {
						rel: 'preload',
						href: '/fonts/Coconat-Regular.woff2',
						as: 'font',
						type: 'font/woff2',
						crossorigin: 'anonymous',
					},
				},
				{
					tag: 'link',
					attrs: {
						rel: 'preload',
						href: '/fonts/Coconat-Demi.woff2',
						as: 'font',
						type: 'font/woff2',
						crossorigin: 'anonymous',
					},
				},
				{
					tag: 'link',
					attrs: {
						rel: 'preload',
						href: '/fonts/Coconat-Bold.woff2',
						as: 'font',
						type: 'font/woff2',
						crossorigin: 'anonymous',
					},
				},
				// Open Graph metadata
				{
					tag: 'meta',
					attrs: {
						property: 'og:image',
						content: `${SITE_URL}/og-image.png`,
					},
				},
				{
					tag: 'meta',
					attrs: {
						name: 'theme-color',
						content: '#ff6a00',
					},
				},
			],
			tableOfContents: {
				minHeadingLevel: 2,
				maxHeadingLevel: 4,
			},
			expressiveCode: {
				themes: ['github-dark', 'github-light'],
				styleOverrides: {
					borderRadius: '0.75rem',
					borderColor: 'rgba(255, 255, 255, 0.1)',
				},
				frames: {
					showCopyToClipboardButton: true,
					removeCommentsWhenCopyingTerminalFrames: true,
				},
			},
		}),
	],
});
