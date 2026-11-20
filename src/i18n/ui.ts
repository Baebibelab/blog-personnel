// Le site n'existe qu'en français pour l'instant. Pour ajouter une langue :
// l'ajouter ici, lui donner son dictionnaire plus bas, et créer les dossiers de contenu.
export const languages = { fr: 'Français' } as const;
export type Lang = keyof typeof languages;
export const langs = Object.keys(languages) as Lang[];
export const defaultLang: Lang = 'fr';

const fr = {
  'site.tagline': 'OHHHH LADIES',
  'site.description': 'Un vrai petit livre de poche. Réunion tup sur mes projets, des notes en vrac et des lectures, films, musique...',
  'nav.home': 'Accueil',
  'nav.journal': 'Journal',
  'nav.notes': 'Notes',
  'nav.projects': 'Projets',
  'nav.shelf': 'Étagère',
  'nav.listening': 'Écoutes',
  'nav.about': 'À propos',
  'home.intro': 'Bienvenue sur mon site. J’y mettrai peut-être des choses sur mes projets et d’autres trucs',
  'home.latestJournal': 'Dernières news du journal',
  'home.latestNotes': 'Des petites notes ? Hmmm des petites notes.',
  'home.projects': 'Projets',
  'home.nowPlaying': 'Dernière écoute',
  'journal.title': 'Journal',
  'journal.intro': 'Hissez-haut moussaillon et vous pourrez lire le journal de bord du vieux capitaine rempli de bons vieux films de culture !! ARRRHGHHHHH .',
  'notes.title': 'Notes',
  'notes.intro': 'Idées, liens et autre en vrac',
  'projects.title': 'Projets',
  'projects.intro': 'What burning ? Roof burning, watafak',
  'projects.related': 'Où suis-je ?',
  'projects.site': 'Site du projet',
  'projects.repo': 'Code source',
  'projects.appStore': 'App Store',
  'status.active': 'En cours',
  'status.paused': 'En pause',
  'status.done': 'Terminé',
  'shelf.title': 'Étagère',
  'shelf.intro': 'Des fois je lis des films ou j’écoute des livres ptn de clavier qwerty',
  'shelf.all': 'Tout',
  'shelf.book': 'Livres',
  'shelf.film': 'Films',
  'shelf.album': 'Albums',
  'shelf.empty': 'L’étagère est encore vide car je suis illetré (illétré ?).',
  'listening.title': 'Écoutes',
  'listening.intro': 'Ce que j’ai écouté récemment, depuis mon serveur Jellyfin. Comment ça on s’en branle ?',
  'listening.unavailable': 'Les écoutes ne sont pas disponibles pour le moment.',
  'listening.updated': 'Mis à jour le',
  'post.updated': 'Mis à jour le',
  'post.backTo': 'Retour à',
  'post.link': 'Lien',
  'empty': 'Rien pour l’instant.',
  'seeAll': 'Tout voir',
  'notFound.title': 'Page introuvable',
  'notFound.text': 'Cette page n’existe pas, ou plus. A-t-elle déjà existé ? Le trip de dingue',
};

export const ui = { fr };
export type UiKey = keyof typeof fr;

export function t(lang: Lang, key: UiKey): string {
  return ui[lang][key] ?? ui[defaultLang][key];
}

export function isLang(value: string | undefined): value is Lang {
  return !!value && value in languages;
}

export function formatDate(date: Date, lang: Lang): string {
  return date.toLocaleDateString(lang, {
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
