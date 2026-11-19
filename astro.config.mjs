// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Hébergement GitHub Pages : https://baebibelab.github.io/blog-personnel/
// Avec un nom de domaine personnel, mettre `site: 'https://mondomaine.fr'`
// et `base: '/'` (et ajouter le fichier public/CNAME).
export default defineConfig({
  site: 'https://baebibelab.github.io',
  base: '/blog-personnel',
  trailingSlash: 'always',
  integrations: [sitemap()],
  markdown: {
    shikiConfig: { themes: { light: 'github-light', dark: 'github-dark' } },
  },
});
