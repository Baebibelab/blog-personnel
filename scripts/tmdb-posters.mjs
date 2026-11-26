// Télécharge les affiches françaises des films du MCU depuis TMDB
// pour la note src/content/notes/fr/mcu-ordre-chronologique.md.
//
// Prérequis : une ligne TMDB_API_KEY=... dans le fichier .env à la racine du projet
// (clé API v3 ou jeton d'accès en lecture v4, themoviedb.org › Paramètres › API).
//
// Lancer : node scripts/tmdb-posters.mjs
// Les affiches déjà présentes ne sont pas retéléchargées (ajouter --force pour tout refaire).

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const OUT = 'src/content/notes/fr/covers/mcu';

// Identifiant TMDB et nom de fichier, dans l'ordre de la note.
const FILMS = [
  [1771, 'captain-america-first-avenger'],
  [299537, 'captain-marvel'],
  [1726, 'iron-man'],
  [10138, 'iron-man-2'],
  [1724, 'l-incroyable-hulk'],
  [10195, 'thor'],
  [24428, 'avengers'],
  [76338, 'thor-le-monde-des-tenebres'],
  [68721, 'iron-man-3'],
  [100402, 'captain-america-le-soldat-de-l-hiver'],
  [118340, 'les-gardiens-de-la-galaxie'],
  [283995, 'les-gardiens-de-la-galaxie-vol-2'],
  [99861, 'avengers-l-ere-d-ultron'],
  [102899, 'ant-man'],
  [271110, 'captain-america-civil-war'],
  [497698, 'black-widow'],
  [284054, 'black-panther'],
  [315635, 'spider-man-homecoming'],
  [284052, 'doctor-strange'],
  [284053, 'thor-ragnarok'],
  [363088, 'ant-man-et-la-guepe'],
  [299536, 'avengers-infinity-war'],
  [299534, 'avengers-endgame'],
  [566525, 'shang-chi'],
  [429617, 'spider-man-far-from-home'],
  [524434, 'les-eternels'],
  [634649, 'spider-man-no-way-home'],
  [453395, 'doctor-strange-multiverse-of-madness'],
  [505642, 'black-panther-wakanda-forever'],
  [616037, 'thor-love-and-thunder'],
  [640146, 'ant-man-et-la-guepe-quantumania'],
  [447365, 'les-gardiens-de-la-galaxie-vol-3'],
  [609681, 'the-marvels'],
  [533535, 'deadpool-et-wolverine'],
  [822119, 'captain-america-brave-new-world'],
  [986056, 'thunderbolts'],
  [617126, 'les-4-fantastiques-premiers-pas'],
  [969681, 'spider-man-brand-new-day'],
];

function readKey() {
  if (process.env.TMDB_API_KEY) return process.env.TMDB_API_KEY.trim();
  if (!existsSync('.env')) return '';
  const line = readFileSync('.env', 'utf8')
    .split(/\r?\n/)
    .find((l) => l.startsWith('TMDB_API_KEY='));
  return line ? line.slice('TMDB_API_KEY='.length).trim().replace(/^["']|["']$/g, '') : '';
}

const key = readKey();
if (!key) {
  console.error('Clé manquante : ajoute TMDB_API_KEY=... dans le fichier .env à la racine du projet.');
  process.exit(1);
}

// Un jeton v4 ressemble à un JWT (commence par « eyJ ») ; sinon c'est une clé v3.
const isToken = key.startsWith('eyJ');
const headers = isToken ? { Authorization: `Bearer ${key}` } : {};

async function api(path) {
  const url = new URL(`https://api.themoviedb.org/3${path}`);
  url.searchParams.set('language', 'fr-FR');
  if (!isToken) url.searchParams.set('api_key', key);
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(`TMDB ${res.status} sur ${path}`);
  return res.json();
}

const force = process.argv.includes('--force');
mkdirSync(OUT, { recursive: true });
let failed = 0;

for (const [id, slug] of FILMS) {
  const file = join(OUT, `${slug}.jpg`);
  if (existsSync(file) && !force) {
    console.log(`déjà là   ${slug}`);
    continue;
  }
  try {
    const movie = await api(`/movie/${id}`);
    if (!movie.poster_path) throw new Error('pas d’affiche');
    const img = await fetch(`https://image.tmdb.org/t/p/w500${movie.poster_path}`);
    if (!img.ok) throw new Error(`image ${img.status}`);
    writeFileSync(file, Buffer.from(await img.arrayBuffer()));
    // Le titre renvoyé par TMDB permet de vérifier que l'identifiant est le bon.
    console.log(`ok        ${slug}  ←  ${movie.title} (${movie.release_date?.slice(0, 4) ?? '?'})`);
  } catch (err) {
    failed++;
    console.error(`ÉCHEC     ${slug} (TMDB ${id}) : ${err.message}`);
  }
}

console.log(failed ? `\n${failed} affiche(s) en échec.` : '\nToutes les affiches sont là.');
process.exit(failed ? 1 : 0);
