// Récupère les écoutes récentes sur le serveur Jellyfin, au moment de la construction du site.
// La clé d'accès ne quitte jamais la machine qui construit le site : les visiteurs ne
// reçoivent que du HTML, et les pochettes sont intégrées dans la page (pas d'URL du serveur).

export interface Listen {
  title: string;
  artist: string;
  album: string;
  playedAt: Date | null;
  cover: string | null;
}

export interface Listening {
  items: Listen[];
  fetchedAt: Date;
}

interface JellyfinItem {
  Name?: string;
  Album?: string;
  AlbumId?: string;
  AlbumArtist?: string;
  Artists?: string[];
  UserData?: { LastPlayedDate?: string };
}

function env(name: string): string | undefined {
  return (import.meta.env[name] as string | undefined) || process.env[name] || undefined;
}

let cache: Promise<Listening | null> | undefined;

/** Renvoie null si Jellyfin n'est pas configuré ou ne répond pas : le site se construit quand même. */
export function getRecentListens(): Promise<Listening | null> {
  cache ??= fetchListens(30);
  return cache;
}

async function fetchListens(limit: number): Promise<Listening | null> {
  const url = env('JELLYFIN_URL');
  const key = env('JELLYFIN_API_KEY');
  const userId = env('JELLYFIN_USER_ID');
  if (!url || !key || !userId) {
    console.info('[jellyfin] non configuré : la page Écoutes sera vide.');
    return null;
  }

  const base = url.replace(/\/+$/, '');
  const headers = { Authorization: `MediaBrowser Token="${key}"` };
  const params = new URLSearchParams({
    IncludeItemTypes: 'Audio',
    Recursive: 'true',
    Filters: 'IsPlayed',
    SortBy: 'DatePlayed',
    SortOrder: 'Descending',
    EnableUserData: 'true',
    Limit: String(limit),
  });

  try {
    const res = await fetch(`${base}/Users/${encodeURIComponent(userId)}/Items?${params}`, {
      headers,
      signal: AbortSignal.timeout(15_000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const { Items = [] } = (await res.json()) as { Items?: JellyfinItem[] };

    const covers = new Map<string, Promise<string | null>>();
    const cover = (albumId: string) => {
      if (!covers.has(albumId)) covers.set(albumId, fetchCover(base, albumId, headers));
      return covers.get(albumId)!;
    };

    const items = await Promise.all(
      Items.map(async (item) => ({
        title: item.Name ?? '',
        artist: item.AlbumArtist || item.Artists?.join(', ') || '',
        album: item.Album ?? '',
        playedAt: item.UserData?.LastPlayedDate ? new Date(item.UserData.LastPlayedDate) : null,
        cover: item.AlbumId ? await cover(item.AlbumId) : null,
      })),
    );
    return { items, fetchedAt: new Date() };
  } catch (error) {
    console.warn(`[jellyfin] impossible de récupérer les écoutes : ${(error as Error).message}`);
    return null;
  }
}

async function fetchCover(
  base: string,
  albumId: string,
  headers: Record<string, string>,
): Promise<string | null> {
  try {
    const res = await fetch(
      `${base}/Items/${encodeURIComponent(albumId)}/Images/Primary?maxWidth=160&quality=80`,
      { headers, signal: AbortSignal.timeout(10_000) },
    );
    if (!res.ok) return null;
    const type = res.headers.get('content-type') ?? 'image/jpeg';
    const bytes = Buffer.from(await res.arrayBuffer());
    return `data:${type};base64,${bytes.toString('base64')}`;
  } catch {
    return null;
  }
}
