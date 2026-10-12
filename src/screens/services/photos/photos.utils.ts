/** Local calendar day, so a night event lands on the day people remember. */
export const dayKey = (iso: string) => {
  const d = new Date(iso);
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
};

/** Rows of `perRow` items, used for the album grid. */
export const chunk = <T>(items: T[], perRow: number) => {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += perRow) {
    out.push(items.slice(i, i + perRow));
  }
  return out;
};

/** Event dates are calendar days ("2026-03-13"): build them in local time so they never shift. */
export const parseEventDate = (iso: string | null) => {
  if (!iso) return null;
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
};

export type AlbumListRow<T extends { id: number; academic_year: string }> =
  | { type: "year"; key: string; year: string }
  | { type: "albums"; key: string; albums: T[] };

/**
 * Album grid rows with one header per academic year. Order is the backend's (event date, newest first), so
 * undated events appear where their first photo puts them; undated and photo-less ones end up last.
 */
export const buildAlbumRows = <T extends { id: number; academic_year: string }>(
  albums: T[],
  perRow: number,
): AlbumListRow<T>[] => {
  const rows: AlbumListRow<T>[] = [];
  let current: T[] = [];
  let year: string | null = null;

  const flush = () => {
    if (current.length > 0) {
      rows.push({ type: "albums", key: `a-${current[0].id}`, albums: current });
      current = [];
    }
  };

  for (const album of albums) {
    if (album.academic_year !== year) {
      flush();
      year = album.academic_year;
      rows.push({ type: "year", key: `y-${album.id}`, year });
    }
    current.push(album);
    if (current.length === perRow) flush();
  }
  flush();
  return rows;
};

export const albumColumnsFor = (width: number) =>
  width >= 800 ? 4 : width >= 560 ? 3 : 2;
