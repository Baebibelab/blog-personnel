# blog-personnel

Mon jardin numérique, en français et en anglais : journal de bord de mes projets, notes, étagère (livres, films, albums) et écoutes Jellyfin.

Construit avec [Astro](https://astro.build), hébergé sur GitHub Pages : <https://baebibelab.github.io/blog-personnel/>

## Lancer le site en local

```sh
npm install
npm run dev
```

Le site s'ouvre sur <http://localhost:4321/blog-personnel/>. En local, les brouillons (`draft: true`) sont visibles. En ligne, ils sont masqués.

## Où écrire

| Rubrique | Dossier | Un fichier par… |
|---|---|---|
| Journal | `src/content/journal/fr/` et `en/` | billet (`.md`) |
| Notes | `src/content/notes/fr/` et `en/` | note (`.md`) |
| Projets | `src/content/projects/fr/` et `en/` | projet (`.md`) |
| Étagère | `src/content/shelf/` | œuvre (`.yaml`, voir `_exemple.yaml`) |
| À propos | `src/content/pages/fr/about.md` et `en/about.md` | — |

Le nom du fichier donne l'adresse de la page : `src/content/journal/fr/mon-billet.md` devient `/fr/journal/mon-billet/`.

Un fichier dont le nom commence par `_` est ignoré.

### Un billet du journal

```md
---
title: Le titre
description: Une phrase de résumé (facultatif)
date: 2026-11-19
project: andia            # ou judo-deckbuilder : le billet apparaît sur la fiche du projet
tags: [swiftui]
draft: true               # facultatif : brouillon visible seulement en local
translationKey: le-titre  # même valeur dans la version anglaise, pour passer de l'une à l'autre
---

Le texte en Markdown.
```

### Une note

Mêmes champs, sans `description` ni `project`, avec en plus `updated` (date de mise à jour) et `link` (pour une note qui partage un lien).

### Traduire ou pas

Un billet peut n'exister que dans une langue. Le lien « English / Français » mène alors à la liste de la rubrique dans l'autre langue.

## Réglages

- **Ton nom** : `src/site.config.ts`.
- **Textes de l'interface** (menus, intros des rubriques) : `src/i18n/ui.ts`.
- **Couleurs et typographie** : `src/styles/global.css`.

## Écoutes Jellyfin

La page Écoutes affiche tes dernières écoutes. Elles sont récupérées **au moment de la construction du site** : la clé d'accès et l'adresse de ton serveur n'apparaissent jamais dans les pages publiées. Les pochettes sont intégrées dans la page.

1. Dans Jellyfin, *Tableau de bord › Clés API* : crée une clé.
2. Trouve ton identifiant utilisateur : *Tableau de bord › Utilisateurs*, clique sur ton compte, l'identifiant est dans l'adresse (`userId=…`).
3. En local : copie `.env.example` en `.env` et remplis les trois valeurs.
4. En ligne : dans le dépôt GitHub, *Settings › Secrets and variables › Actions*, ajoute les secrets `JELLYFIN_URL`, `JELLYFIN_API_KEY` et `JELLYFIN_USER_ID`.

Le serveur doit être joignable depuis Internet pour que GitHub puisse le lire. Sans configuration, ou si le serveur ne répond pas, le site se construit quand même et la page Écoutes l'indique.

Le site se reconstruit chaque nuit (`.github/workflows/deploy.yml`) pour mettre les écoutes à jour.

## Mise en ligne

Chaque push sur `main` déploie le site.

Une seule fois : dans le dépôt GitHub, *Settings › Pages › Build and deployment › Source*, choisir **GitHub Actions**.

### Avec un nom de domaine

Dans `astro.config.mjs`, mettre `site: 'https://mondomaine.fr'` et `base: '/'`, ajouter un fichier `public/CNAME` qui contient le domaine, puis le déclarer dans *Settings › Pages › Custom domain*.
