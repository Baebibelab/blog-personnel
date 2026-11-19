export const languages = { fr: 'Français', en: 'English' } as const;
export type Lang = keyof typeof languages;
export const langs = Object.keys(languages) as Lang[];
export const defaultLang: Lang = 'fr';

const fr = {
  'site.tagline': 'Journal de bord, notes et étagère',
  'site.description': 'Mon jardin numérique : journal de bord de mes projets, notes en vrac, lectures, films et musique.',
  'nav.home': 'Accueil',
  'nav.journal': 'Journal',
  'nav.notes': 'Notes',
  'nav.projects': 'Projets',
  'nav.shelf': 'Étagère',
  'nav.listening': 'Écoutes',
  'nav.about': 'À propos',
  'nav.switch': 'English',
  'home.intro': 'Bienvenue dans mon jardin numérique. J’y garde une trace de mes projets, de mes idées et de ce que je lis, regarde et écoute.',
  'home.latestJournal': 'Derniers billets du journal',
  'home.latestNotes': 'Dernières notes',
  'home.projects': 'Projets',
  'home.nowPlaying': 'Dernière écoute',
  'journal.title': 'Journal',
  'journal.intro': 'Le journal de bord de mes projets : ce que j’ai fait, ce que j’ai appris, ce qui coince.',
  'notes.title': 'Notes',
  'notes.intro': 'Idées, liens et trouvailles, en vrac. Certaines notes évoluent avec le temps.',
  'projects.title': 'Projets',
  'projects.intro': 'Ce que je construis en ce moment.',
  'projects.related': 'Billets du journal sur ce projet',
  'projects.site': 'Site du projet',
  'projects.repo': 'Code source',
  'projects.appStore': 'App Store',
  'status.active': 'En cours',
  'status.paused': 'En pause',
  'status.done': 'Terminé',
  'shelf.title': 'Étagère',
  'shelf.intro': 'Les livres, films et albums qui sont passés entre mes mains, avec une note et un avis court.',
  'shelf.all': 'Tout',
  'shelf.book': 'Livres',
  'shelf.film': 'Films',
  'shelf.album': 'Albums',
  'shelf.empty': 'L’étagère est encore vide.',
  'listening.title': 'Écoutes',
  'listening.intro': 'Ce que j’ai écouté récemment, depuis mon serveur Jellyfin. La liste se met à jour chaque nuit.',
  'listening.unavailable': 'Les écoutes ne sont pas disponibles pour le moment.',
  'listening.updated': 'Mis à jour le',
  'post.updated': 'Mis à jour le',
  'post.backTo': 'Retour à',
  'post.link': 'Lien',
  'empty': 'Rien pour l’instant.',
  'seeAll': 'Tout voir',
  'notFound.title': 'Page introuvable',
  'notFound.text': 'Cette page n’existe pas, ou plus.',
};

const en: Record<keyof typeof fr, string> = {
  'site.tagline': 'Devlog, notes and shelf',
  'site.description': 'My digital garden: a devlog of my projects, loose notes, books, films and music.',
  'nav.home': 'Home',
  'nav.journal': 'Devlog',
  'nav.notes': 'Notes',
  'nav.projects': 'Projects',
  'nav.shelf': 'Shelf',
  'nav.listening': 'Listening',
  'nav.about': 'About',
  'nav.switch': 'Français',
  'home.intro': 'Welcome to my digital garden. This is where I keep track of my projects, my ideas, and what I read, watch and listen to.',
  'home.latestJournal': 'Latest devlog entries',
  'home.latestNotes': 'Latest notes',
  'home.projects': 'Projects',
  'home.nowPlaying': 'Last played',
  'journal.title': 'Devlog',
  'journal.intro': 'A logbook of my projects: what I did, what I learned, what got in the way.',
  'notes.title': 'Notes',
  'notes.intro': 'Ideas, links and findings, loosely kept. Some notes grow over time.',
  'projects.title': 'Projects',
  'projects.intro': 'What I am building right now.',
  'projects.related': 'Devlog entries about this project',
  'projects.site': 'Project website',
  'projects.repo': 'Source code',
  'projects.appStore': 'App Store',
  'status.active': 'Active',
  'status.paused': 'Paused',
  'status.done': 'Done',
  'shelf.title': 'Shelf',
  'shelf.intro': 'Books, films and albums I went through, with a rating and a short review.',
  'shelf.all': 'All',
  'shelf.book': 'Books',
  'shelf.film': 'Films',
  'shelf.album': 'Albums',
  'shelf.empty': 'The shelf is still empty.',
  'listening.title': 'Listening',
  'listening.intro': 'What I listened to recently, from my Jellyfin server. The list refreshes every night.',
  'listening.unavailable': 'Listening history is not available right now.',
  'listening.updated': 'Updated on',
  'post.updated': 'Updated on',
  'post.backTo': 'Back to',
  'post.link': 'Link',
  'empty': 'Nothing yet.',
  'seeAll': 'See all',
  'notFound.title': 'Page not found',
  'notFound.text': 'This page does not exist, or no longer does.',
};

export const ui = { fr, en };
export type UiKey = keyof typeof fr;

export function t(lang: Lang, key: UiKey): string {
  return ui[lang][key] ?? ui[defaultLang][key];
}

export function isLang(value: string | undefined): value is Lang {
  return !!value && value in languages;
}

export function otherLang(lang: Lang): Lang {
  return lang === 'fr' ? 'en' : 'fr';
}

export function formatDate(date: Date, lang: Lang): string {
  return date.toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/** Construit un lien interne qui tient compte du `base` de astro.config.mjs. */
export function href(...segments: (string | undefined)[]): string {
  const base = import.meta.env.BASE_URL.replace(/\/+$/, '');
  const path = segments
    .filter((s): s is string => !!s)
    .map((s) => s.replace(/^\/+|\/+$/g, ''))
    .filter(Boolean)
    .join('/');
  const isFile = /\.[a-z0-9]+$/i.test(path);
  return `${base}/${path}${path && !isFile ? '/' : ''}`;
}
