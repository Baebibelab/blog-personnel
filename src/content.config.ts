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

// Date de fin d'une œuvre : un jour (2026-11-17), un mois (2025-05) ou une année seule (2015).
const finishedDate = z
  .union([z.date(), z.number().int(), z.string()])
  .transform((value, ctx) => {
    if (value instanceof Date) return { date: value, precision: 'day' as const };
    const match = String(value).match(/^(\d{4})(?:-(\d{1,2})(?:-(\d{1,2}))?)?$/);
    if (!match) {
      ctx.addIssue({ code: 'custom', message: 'Date attendue : 2026-11-17, 2025-05 ou 2015' });
      return z.NEVER;
    }
    const [, year, month, day] = match;
    return {
      date: new Date(Date.UTC(Number(year), month ? Number(month) - 1 : 0, day ? Number(day) : 1)),
      precision: day ? ('day' as const) : month ? ('month' as const) : ('year' as const),
    };
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
      finished: finishedDate,
      review: z.string().optional(),
      // Image de couverture, chemin relatif au fichier YAML (ex. ./covers/dune.jpg).
      cover: image().optional(),
      // Effet spécial sur la couverture, pour un clin d'œil à l'œuvre.
      // papercut : la couverture s'agite par saccades au survol, façon papier découpé.
      // elastic : la couverture s'étire comme du caoutchouc au survol, puis revient en rebondissant.
      // bullets : trois impacts de balle criblent la couverture au survol, qui tressaute à chaque tir.
      // slash : un coup de lame traverse la couverture au survol, qui se sépare en deux morceaux.
      // eclipse : la couverture s'assombrit, une éclipse rouge se lève et elle se met à trembler.
      // fourth-wall : la couverture se tourne vers le visiteur et lui parle dans une bulle de BD.
      // apple : une pomme tombe sur la couverture, rebondit, puis se fait croquer deux fois.
      // portal : un portail vert s'ouvre, aspire la couverture en tourbillonnant puis la recrache.
      // snap : la couverture part en poussière comme après un claquement de doigts, puis se reforme.
      // glyph : un cercle magique se dessine à l'encre sur la couverture, puis s'illumine.
      // upside-down : les lumières clignotent et la couverture bascule dans le Monde à l'envers.
      // crack : un impact fissure la couverture comme un écran brisé.
      // comet : une comète traverse la couverture et se scinde en deux, sous un ciel de crépuscule.
      // spotlight : un projecteur tombe du ciel au pied de la couverture, qui passe à l'antenne.
      // domain : les ténèbres se referment sur la couverture (extension du territoire), puis un éclair noir la frappe.
      // split-screen : la couverture se découpe en trois bandes façon générique des années 60.
      // cipher : la couverture vire au jaune et un triangle à l'œil unique apparaît, puis cligne.
      // skadoosh : la couverture se fige, puis une onde de choc dorée part en anneau.
      // water : une vague bleue de souffle de l'eau tourbillonne à travers la couverture.
      // parachute : un parachutiste descend en se balançant et atterrit sur la couverture.
      // bat-signal : la nuit tombe sous la pluie et un signal de chauve-souris s'allume dans le ciel.
      // ufo : une soucoupe volante arrive et aspire la couverture dans son rayon, puis la relâche.
      effect: z
        .enum([
          'papercut',
          'elastic',
          'bullets',
          'slash',
          'eclipse',
          'fourth-wall',
          'apple',
          'portal',
          'snap',
          'glyph',
          'upside-down',
          'crack',
          'comet',
          'spotlight',
          'domain',
          'split-screen',
          'cipher',
          'skadoosh',
          'water',
          'parachute',
          'bat-signal',
          'ufo',
        ])
        .optional(),
    })
    // `finished` reste une date ; `finishedPrecision` dit s'il faut afficher le jour, le mois ou l'année.
    .transform(({ finished, ...data }) => ({
      ...data,
      finished: finished.date,
      finishedPrecision: finished.precision,
    })),
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
