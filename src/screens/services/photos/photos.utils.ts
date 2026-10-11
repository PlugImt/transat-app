import type { Photo } from "@/dto";

export const GRID_GAP = 2;
export const HEADER_ROW_HEIGHT = 52;

export type DayHeaderRow = {
  type: "header";
  key: string;
  date: Date;
  height: number;
  offset: number;
};

export type PhotoRow = {
  type: "row";
  key: string;
  photos: Photo[];
  height: number;
  offset: number;
};

export type GridRow = DayHeaderRow | PhotoRow;

export type GridLayout = {
  rows: GridRow[];
  /** Index of every photo (by id) inside the flat list the viewer pages through. */
  imageIndex: Map<string, number>;
  images: Photo[];
};

/** 3 columns on phones, more on tablets and landscape. */
export const columnsFor = (width: number) => {
  if (width >= 1100) return 7;
  if (width >= 800) return 5;
  if (width >= 560) return 4;
  return 3;
};

export const tileSizeFor = (width: number, columns: number) =>
  Math.floor((width - GRID_GAP * (columns - 1)) / columns);

/** Local calendar day, so a night event lands on the day people remember. */
export const dayKey = (iso: string) => {
  const d = new Date(iso);
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
};

/**
 * Lays photos out as virtualizable rows. Headers (one per day) are optional; photos keep the backend order.
 * Row keys are the first photo's id, so appending a page never remounts the rows above it.
 */
export const buildRows = (
  photos: Photo[],
  columns: number,
  tile: number,
  groupByDay: boolean,
): GridLayout => {
  const rows: GridRow[] = [];
  const images: Photo[] = [];
  const imageIndex = new Map<string, number>();
  const rowHeight = tile + GRID_GAP;
  let offset = 0;
  let current: Photo[] = [];
  let currentDay: string | null = null;

  const flush = () => {
    if (current.length === 0) return;
    rows.push({
      type: "row",
      key: current[0].id,
      photos: current,
      height: rowHeight,
      offset,
    });
    offset += rowHeight;
    current = [];
  };

  for (const photo of photos) {
    if (photo.media_type === "image") {
      imageIndex.set(photo.id, images.length);
      images.push(photo);
    }
    if (groupByDay) {
      const day = dayKey(photo.sort_at);
      if (day !== currentDay) {
        flush();
        rows.push({
          type: "header",
          key: `h-${day}`,
          date: new Date(photo.sort_at),
          height: HEADER_ROW_HEIGHT,
          offset,
        });
        offset += HEADER_ROW_HEIGHT;
        currentDay = day;
      }
    }
    current.push(photo);
    if (current.length === columns) flush();
  }
  flush();

  return { rows, imageIndex, images };
};

/** Rows of `perRow` items, used for the album grid. */
export const chunk = <T>(items: T[], perRow: number) => {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += perRow) {
    out.push(items.slice(i, i + perRow));
  }
  return out;
};

/** Whether the photos of an album span more than one calendar day (single-day events get no day header). */
export const spansSeveralDays = (
  firstTakenAt: string | null,
  lastTakenAt: string | null,
) => {
  if (!firstTakenAt || !lastTakenAt) return false;
  return dayKey(firstTakenAt) !== dayKey(lastTakenAt);
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
