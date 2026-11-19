// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Hébergé sur GitHub Pages avec le domaine personnel romainbeal.fr
// (déclaré dans Settings › Pages › Custom domain, DNS chez OVH).
// Sans domaine personnel, ce serait `site: 'https://baebibelab.github.io'`
// et `base: '/blog-personnel'`.
export default defineConfig({
  site: 'https://romainbeal.fr',
  base: '/',
  trailingSlash: 'always',
  integrations: [sitemap()],
  markdown: {
    shikiConfig: { themes: { light: 'github-light', dark: 'github-dark' } },
  },
});
