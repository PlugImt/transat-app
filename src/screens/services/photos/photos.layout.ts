import type { LayoutLevel } from "@/constants";
import type { Photo } from "@/dto";
import { dayKey } from "./photos.utils";

export const GRID_GAP = 2;
export const HEADER_ROW_HEIGHT = 52;
/** Taller: the event name above the date. */
export const EVENT_HEADER_ROW_HEIGHT = 64;

export type Tile = {
  photo: Photo;
  x: number;
  y: number;
  width: number;
  height: number;
};

export type DayHeaderRow = {
  type: "header";
  key: string;
  date: Date;
  /** The last day of an event that spans several days; the header shows the range. */
  endDate: Date | null;
  /** The event the group belongs to, when it is grouped by event and has one. */
  title: string | null;
  height: number;
  offset: number;
};

export type PhotoRow = {
  type: "row";
  key: string;
  tiles: Tile[];
  height: number;
  offset: number;
};

export type GridRow = DayHeaderRow | PhotoRow;

export type GridLayout = {
  rows: GridRow[];
  /** Index of every image (by id) inside the flat list the viewer pages through. */
  imageIndex: Map<string, number>;
  images: Photo[];
  /** Row index of every photo, to find a photo again after the layout changed. */
  rowOfPhoto: Map<string, number>;
};

/** Columns of the standard level: 3 on phones, more on tablets and landscape. */
export const columnsFor = (width: number) => {
  if (width >= 1100) return 7;
  if (width >= 800) return 5;
  if (width >= 560) return 4;
  return 3;
};

export const columnsForLevel = (level: LayoutLevel, width: number) => {
  const standard = columnsFor(width);
  if (level === "compact") return standard + 2;
  return standard;
};

export const tileSizeFor = (width: number, columns: number) =>
  Math.floor((width - GRID_GAP * (columns - 1)) / columns);

/** The mosaic aims at rows a little taller than standard tiles. */
const mosaicRowHeight = (width: number) =>
  Math.round(tileSizeFor(width, columnsFor(width)) * 1.2);

type Block = { tiles: Tile[]; height: number };

const clamp = (v: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, v));

const hasDimensions = (p: Photo) => p.width > 0 && p.height > 0;

/** Layout aspect ratio: missing sizes count as square, extreme panoramas and strips are tamed. */
const aspectOf = (p: Photo) =>
  hasDimensions(p) ? clamp(p.width / p.height, 0.6, 2) : 1;

/** FNV-1a: a stable pseudo-random number per photo id, so the mosaic never reshuffles. */
export const hashId = (id: string) => {
  let h = 0x811c9dc5;
  for (let i = 0; i < id.length; i++) {
    h ^= id.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
};

const toBlock = (
  photos: Photo[],
  widths: number[],
  height: number,
  gap: number,
): Block => {
  let x = 0;
  return {
    height,
    tiles: photos.map((photo, i) => {
      const tile = { photo, x, y: 0, width: widths[i], height };
      x += widths[i] + gap;
      return tile;
    }),
  };
};

/**
 * One row of photos side by side. Natural height fills the width exactly; when that would crop too much, the row is
 * stretched within bounds, or left short rather than blowing a lone photo up to full width.
 */
const justifiedRow = (
  photos: Photo[],
  width: number,
  gap: number,
  target: number,
  provisional: boolean,
): Block => {
  const ratios = photos.map(aspectOf);
  const sum = ratios.reduce((a, b) => a + b, 0);
  const room = width - gap * (photos.length - 1);
  const natural = room / sum;

  if (provisional) {
    // The list may still grow: keep the row short so it never has to be redrawn at full width.
    const scale = Math.min(1, room / (sum * target));
    const widths = ratios.map((r) => Math.floor(r * target * scale));
    return toBlock(photos, widths, Math.round(target * scale), gap);
  }
  if (natural > target * 1.4) {
    const height = Math.round(target * 1.4);
    return toBlock(
      photos,
      ratios.map((r) => Math.floor(r * height)),
      height,
      gap,
    );
  }
  const height = Math.round(Math.max(natural, target * 0.75));
  const widths = ratios.map((r) => Math.floor((room * r) / sum));
  widths[widths.length - 1] += room - widths.reduce((a, b) => a + b, 0);
  return toBlock(photos, widths, height, gap);
};

/** One photo across the full width. */
const heroBlock = (photo: Photo, width: number): Block => {
  const height = Math.round(width / clamp(aspectOf(photo), 1.35, 2));
  return { height, tiles: [{ photo, x: 0, y: 0, width, height }] };
};

/** A large tile (2/3 of the width) next to two stacked ones. Reading order stays big, then the two small ones. */
const featureBlock = (trio: Photo[], width: number, gap: number): Block => {
  const bigWidth = Math.round(((width - gap) * 2) / 3);
  const smallWidth = width - gap - bigWidth;
  const wanted = Math.round(bigWidth * clamp(1 / aspectOf(trio[0]), 0.85, 1.2));
  const smallHeight = Math.floor((wanted - gap) / 2);
  const height = smallHeight * 2 + gap;
  return {
    height,
    tiles: [
      { photo: trio[0], x: 0, y: 0, width: bigWidth, height },
      {
        photo: trio[1],
        x: bigWidth + gap,
        y: 0,
        width: smallWidth,
        height: smallHeight,
      },
      {
        photo: trio[2],
        x: bigWidth + gap,
        y: smallHeight + gap,
        width: smallWidth,
        height: smallHeight,
      },
    ],
  };
};

/** Photos since the last large block before another one may appear. */
const BIG_SPACING = 5;

/**
 * Lays out one group of photos (a day, or everything) as mosaic blocks. Decisions depend only on the photo ids and
 * shapes, and only on photos at or after the current one, so appending a page never changes the blocks above it.
 * `complete` says no photo follows this group, which is when the last row may be stretched or merged.
 */
const mosaicBlocks = (
  group: Photo[],
  width: number,
  gap: number,
  complete: boolean,
): Block[] => {
  const target = mosaicRowHeight(width);
  const maxPerRow = Math.max(3, Math.round(width / target) + 1);
  const heightFor = (count: number, sum: number) =>
    (width - gap * (count - 1)) / sum;
  const blocks: Block[] = [];
  const n = group.length;
  let i = 0;
  let sinceBig = 0;

  while (i < n) {
    const remaining = n - i;
    const photo = group[i];
    const hash = hashId(photo.id);
    const roomForBig = sinceBig >= BIG_SPACING;

    // A group never ends with a single orphan photo: blocks that would leave one are not chosen.
    const feature =
      roomForBig &&
      remaining >= 3 &&
      remaining !== 4 &&
      hash % (aspectOf(photo) < 0.9 ? 4 : 6) === 0;
    const hero =
      !feature &&
      roomForBig &&
      remaining !== 2 &&
      hasDimensions(photo) &&
      aspectOf(photo) >= 1.35 &&
      (hash >>> 4) % 9 === 0;

    if (feature) {
      blocks.push(featureBlock(group.slice(i, i + 3), width, gap));
      i += 3;
      sinceBig = 0;
      continue;
    }
    if (hero) {
      blocks.push(heroBlock(photo, width));
      i += 1;
      sinceBig = 0;
      continue;
    }

    let used = 0;
    let sum = 0;
    let prevSum = 0;
    let prevHeight = Number.POSITIVE_INFINITY;
    let height = 0;
    const limit = Math.min(maxPerRow, remaining);
    while (used < limit) {
      prevSum = sum;
      prevHeight = used > 0 ? heightFor(used, sum) : Number.POSITIVE_INFINITY;
      sum += aspectOf(group[i + used]);
      used++;
      height = heightFor(used, sum);
      if (height <= target) break;
    }
    // Too squat with this many photos: one fewer gives the closer row.
    if (used > 1 && height < target * 0.8 && prevHeight <= target * 1.5) {
      used--;
      sum = prevSum;
    }
    if (complete && n - (i + used) === 1) used++;

    const end = i + used;
    blocks.push(
      justifiedRow(
        group.slice(i, end),
        width,
        gap,
        target,
        !complete && end >= n,
      ),
    );
    i = end;
    sinceBig += used;
  }
  return blocks;
};

/** Uniform tiles, `columns` per row; the last row of a group stays partial. */
const uniformBlocks = (
  group: Photo[],
  columns: number,
  tile: number,
  gap: number,
): Block[] => {
  const blocks: Block[] = [];
  for (let i = 0; i < group.length; i += columns) {
    blocks.push({
      height: tile,
      tiles: group.slice(i, i + columns).map((photo, c) => ({
        photo,
        x: c * (tile + gap),
        y: 0,
        width: tile,
        height: tile,
      })),
    });
  }
  return blocks;
};

type BuildOptions = {
  level: LayoutLevel;
  width: number;
  /** One header per day, one per event whatever the days it spans, or none. */
  grouping: "none" | "day" | "event";
  /** No further page will be appended: the last row may take its final shape. */
  complete: boolean;
};

/**
 * Lays photos out as virtualizable rows with known heights and offsets. Headers (one per day) are optional; photos
 * keep the backend order. Row keys are the first photo's id, so appending a page never remounts the rows above it.
 */
export const buildRows = (
  photos: Photo[],
  { level, width, grouping, complete }: BuildOptions,
): GridLayout => {
  const rows: GridRow[] = [];
  const images: Photo[] = [];
  const imageIndex = new Map<string, number>();
  const rowOfPhoto = new Map<string, number>();
  const gap = GRID_GAP;
  const columns = columnsForLevel(level, width);
  const tile = tileSizeFor(width, columns);
  let offset = 0;

  const addGroup = (group: Photo[], last: boolean) => {
    const blocks =
      level === "mosaic"
        ? mosaicBlocks(group, width, gap, complete || !last)
        : uniformBlocks(group, columns, tile, gap);
    for (const block of blocks) {
      const height = block.height + gap;
      const row: PhotoRow = {
        type: "row",
        key: block.tiles[0].photo.id,
        tiles: block.tiles,
        height,
        offset,
      };
      for (const t of block.tiles) rowOfPhoto.set(t.photo.id, rows.length);
      rows.push(row);
      offset += height;
    }
  };

  for (const photo of photos) {
    if (photo.media_type === "image") {
      imageIndex.set(photo.id, images.length);
      images.push(photo);
    }
  }

  if (grouping === "none") {
    if (photos.length > 0) addGroup(photos, true);
    return { rows, images, imageIndex, rowOfPhoto };
  }

  // An event is one group even when it spans several days; photos without one stay grouped by day.
  const groupOf = (p: Photo) =>
    grouping === "event" && p.album_id !== null
      ? `a${p.album_id}`
      : `d${dayKey(p.sort_at)}`;

  let start = 0;
  while (start < photos.length) {
    const group = groupOf(photos[start]);
    let end = start + 1;
    while (end < photos.length && groupOf(photos[end]) === group) end += 1;
    const title = grouping === "event" ? photos[start].album_title : null;
    const height = title ? EVENT_HEADER_ROW_HEIGHT : HEADER_ROW_HEIGHT;
    let first = new Date(photos[start].sort_at);
    let last = first;
    for (let i = start + 1; i < end; i++) {
      const at = new Date(photos[i].sort_at);
      if (at < first) first = at;
      if (at > last) last = at;
    }
    const spansDays =
      dayKey(first.toISOString()) !== dayKey(last.toISOString());
    rows.push({
      type: "header",
      // The first photo's id keeps keys unique when the same event comes back after other photos.
      key: `h-${group}-${photos[start].id}`,
      date: spansDays ? first : new Date(photos[start].sort_at),
      endDate: spansDays ? last : null,
      title,
      height,
      offset,
    });
    offset += height;
    addGroup(photos.slice(start, end), end >= photos.length);
    start = end;
  }
  return { rows, images, imageIndex, rowOfPhoto };
};

/** Whether two rows draw the same thing, so memoised rows skip re-rendering when a page is appended. */
export const sameRow = (a: PhotoRow, b: PhotoRow) =>
  a.key === b.key &&
  a.height === b.height &&
  a.tiles.length === b.tiles.length &&
  a.tiles.every((t, i) => {
    const o = b.tiles[i];
    return (
      t.photo.id === o.photo.id &&
      t.x === o.x &&
      t.width === o.width &&
      t.height === o.height
    );
  });
