import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Les fichiers dont le nom commence par « _ » sont ignorés (modèles, brouillons privés).
const markdown = '**/[^_]*.md';

// Journal de bord : src/content/journal/fr/<slug>.md
const journal = defineCollection({
  loader: glob({ pattern: markdown, base: './src/content/journal' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.coerce.date(),
    // Identifiant d'un projet (champ `key` d'une fiche projet), pour relier le billet au projet.
    project: z.string().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

// Notes en vrac : src/content/notes/fr/<slug>.md
const notes = defineCollection({
  loader: glob({ pattern: markdown, base: './src/content/notes' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    // Pour une note qui partage un lien.
    link: z.string().url().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

// Fiches projet : src/content/projects/fr/<slug>.md
const projects = defineCollection({
  loader: glob({ pattern: markdown, base: './src/content/projects' }),
  schema: z.object({
    // Identifiant du projet, repris par le champ `project` des billets.
    key: z.string(),
    title: z.string(),
    tagline: z.string(),
    status: z.enum(['active', 'paused', 'done']).default('active'),
    platform: z.string().optional(),
    tech: z.array(z.string()).default([]),
    links: z
      .object({
        site: z.string().url().optional(),
        repo: z.string().url().optional(),
        appStore: z.string().url().optional(),
      })
      .default({}),
    order: z.number().default(0),
  }),
});

// Étagère : un fichier YAML par œuvre, src/content/shelf/<slug>.yaml (voir _exemple.yaml)
const shelf = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{yaml,yml}', base: './src/content/shelf' }),
  schema: ({ image }) =>
    z.object({
      type: z.enum(['book', 'manga', 'film', 'series', 'album']),
      title: z.string(),
      creator: z.string(),
      year: z.number().optional(),
      // Où tu en es pour une œuvre en plusieurs parties, par exemple « Tomes 1 à 22 » ou « Saisons 1 et 2 ».
      progress: z.string().optional(),
      rating: z.number().min(0).max(5).optional(),
      finished: z.coerce.date(),
      review: z.string().optional(),
      // Image de couverture, chemin relatif au fichier YAML (ex. ./covers/dune.jpg).
      cover: image().optional(),
    }),
});

// Pages simples (À propos) : src/content/pages/fr/<slug>.md
const pages = defineCollection({
  loader: glob({ pattern: markdown, base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
  }),
});

export const collections = { journal, notes, projects, shelf, pages };
