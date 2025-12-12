// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
	site: 'https://blog.devcult.io',
	vite: {
		plugins: [tailwindcss()]
	},
	integrations: [
		starlight({
			title: 'DevCult Blog',
			description: 'Technical insights, developer experience, and DevRel best practices from the DevCult team.',
			logo: {
				src: './src/assets/logo.svg',
				replacesTitle: false,
			},
			social: [
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/0xDevCult' },
				{ icon: 'x.com', label: 'X / Twitter', href: 'https://x.com/0xDevCult' },
				{ icon: 'linkedin', label: 'LinkedIn', href: 'https://linkedin.com/company/devcult' },
			],
			customCss: [
				'./src/styles/custom.css',
			],
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
				baseUrl: 'https://github.com/0xDevCult/blog/edit/main/',
			},
			lastUpdated: true,
			pagination: true,
			favicon: '/favicon.svg',
			head: [
				{
					tag: 'meta',
					attrs: {
						property: 'og:image',
						content: 'https://blog.devcult.io/og-image.png',
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
