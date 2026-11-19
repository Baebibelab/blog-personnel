import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { href, langs, t, type Lang } from '../../i18n/ui';
import { entrySlug, getJournal, getNotes } from '../../lib/content';
import { site } from '../../site.config';

export function getStaticPaths() {
  return langs.map((lang) => ({ params: { lang } }));
}

export async function GET(context: APIContext) {
  const lang = context.params.lang as Lang;
  const journal = (await getJournal(lang)).filter((e) => !e.data.draft);
  const notes = (await getNotes(lang)).filter((e) => !e.data.draft);

  const items = [
    ...journal.map((e) => ({
      title: e.data.title,
      pubDate: e.data.date,
      description: e.data.description,
      link: href(lang, 'journal', entrySlug(e.id)),
      categories: [t(lang, 'journal.title'), ...e.data.tags],
    })),
    ...notes.map((e) => ({
      title: e.data.title,
      pubDate: e.data.date,
      link: href(lang, 'notes', entrySlug(e.id)),
      categories: [t(lang, 'notes.title'), ...e.data.tags],
    })),
  ].sort((a, b) => b.pubDate.valueOf() - a.pubDate.valueOf());

  return rss({
    title: `${site.author} · ${t(lang, 'site.tagline')}`,
    description: t(lang, 'site.description'),
    site: context.site!,
    items,
    customData: `<language>${lang}</language>`,
  });
}
