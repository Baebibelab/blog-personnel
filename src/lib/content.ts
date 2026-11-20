import { getCollection, type CollectionEntry } from 'astro:content';
import type { Lang } from '../i18n/ui';

export type Post = CollectionEntry<'journal'> | CollectionEntry<'notes'>;

/** « fr/mon-billet » → « fr » */
export function entryLang(id: string): Lang {
  return id.split('/')[0] as Lang;
}

/** « fr/mon-billet » → « mon-billet » */
export function entrySlug(id: string): string {
  return id.split('/').slice(1).join('/');
}

const visible = (draft: boolean) => import.meta.env.DEV || !draft;

export async function getJournal(lang: Lang) {
  const entries = await getCollection(
    'journal',
    ({ id, data }) => id.startsWith(`${lang}/`) && visible(data.draft),
  );
  return entries.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export async function getNotes(lang: Lang) {
  const entries = await getCollection(
    'notes',
    ({ id, data }) => id.startsWith(`${lang}/`) && visible(data.draft),
  );
  return entries.sort(
    (a, b) =>
      (b.data.updated ?? b.data.date).valueOf() - (a.data.updated ?? a.data.date).valueOf(),
  );
}

export async function getProjects(lang: Lang) {
  const entries = await getCollection('projects', ({ id }) => id.startsWith(`${lang}/`));
  return entries.sort((a, b) => a.data.order - b.data.order);
}
