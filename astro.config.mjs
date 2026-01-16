// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
	site: 'https://satoru.work',
	image: {
		layout: 'constrained',
		responsiveStyles: true,
	},
	integrations: [
		(await import('@playform/inline')).default(),
		(await import('@playform/compress')).default(),
	],
	vite: {
		plugins: [tailwindcss()],
	},
});
