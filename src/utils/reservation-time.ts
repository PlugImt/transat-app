export const PARIS_TIME_ZONE = "Europe/Paris";

/** Slots are one hour long and run from 08:00 to 01:00 (Paris time). */
export const SLOT_FIRST_HOUR = 8;
export const SLOT_COUNT = 17;

export type DaySlot = { start: Date; end: Date };

const parisFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: PARIS_TIME_ZONE,
  hourCycle: "h23",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
});

const parisParts = (date: Date) => {
  const parts: Record<string, number> = {};
  for (const { type, value } of parisFormatter.formatToParts(date)) {
    if (type !== "literal") parts[type] = Number(value);
  }
  return parts;
};

/** Offset of Paris from UTC at the given instant, in milliseconds. */
const parisOffsetMs = (date: Date): number => {
  const p = parisParts(date);
  // Some engines report midnight as hour 24.
  const asUtc = Date.UTC(
    p.year,
    p.month - 1,
    p.day,
    p.hour % 24,
    p.minute,
    p.second,
  );
  return asUtc - Math.floor(date.getTime() / 1000) * 1000;
};

/** Instant at which Paris clocks read the given wall time. Hours may overflow (24 = next day 00:00). */
export const parisWallTimeToDate = (
  year: number,
  month: number,
  day: number,
  hour: number,
  minute = 0,
): Date => {
  const wallAsUtc = Date.UTC(year, month - 1, day, hour, minute);
  const firstGuess = wallAsUtc - parisOffsetMs(new Date(wallAsUtc));
  // Second pass settles the guess across a daylight-saving change.
  return new Date(wallAsUtc - parisOffsetMs(new Date(firstGuess)));
};

const splitYmd = (ymd: string) => {
  const [year, month, day] = ymd.split("-").map(Number);
  return { year, month, day };
};

/** Calendar day (YYYY-MM-DD) in Paris for the given instant. */
export const getParisYmd = (date: Date): string => {
  const p = parisParts(date);
  return `${p.year}-${String(p.month).padStart(2, "0")}-${String(p.day).padStart(2, "0")}`;
};

export const shiftYmd = (ymd: string, days: number): string => {
  const { year, month, day } = splitYmd(ymd);
  return new Date(Date.UTC(year, month - 1, day + days))
    .toISOString()
    .slice(0, 10);
};

const DAY_MS = 86_400_000;

/** Days the calendar can be scrolled on each side of the day it opens on. */
export const DAY_RANGE = 5000;

/** One entry per scrollable day; the day itself is derived from its index. */
export const DAY_INDEXES = Array.from(
  { length: DAY_RANGE * 2 + 1 },
  (_, index) => index,
);

export const indexToYmd = (anchor: string, index: number): string =>
  shiftYmd(anchor, index - DAY_RANGE);

export const ymdToIndex = (anchor: string, ymd: string): number => {
  const from = splitYmd(anchor);
  const to = splitYmd(ymd);
  return (
    DAY_RANGE +
    Math.round(
      (Date.UTC(to.year, to.month - 1, to.day) -
        Date.UTC(from.year, from.month - 1, from.day)) /
        DAY_MS,
    )
  );
};

/** Days from the given day to the 1st of the following month. */
export const daysUntilNextMonth = (ymd: string): number => {
  const { year, month, day } = splitYmd(ymd);
  return Math.round(
    (Date.UTC(year, month, 1) - Date.UTC(year, month - 1, day)) / DAY_MS,
  );
};

/** Noon on that calendar day in the device time zone, safe to format as a label. */
export const ymdToLabelDate = (ymd: string): Date => {
  const { year, month, day } = splitYmd(ymd);
  return new Date(year, month - 1, day, 12);
};

export const buildDaySlots = (ymd: string): DaySlot[] => {
  const { year, month, day } = splitYmd(ymd);
  return Array.from({ length: SLOT_COUNT }, (_, index) => ({
    start: parisWallTimeToDate(year, month, day, SLOT_FIRST_HOUR + index),
    end: parisWallTimeToDate(year, month, day, SLOT_FIRST_HOUR + index + 1),
  }));
};

/** Format the API expects: UTC wall time, "YYYY-MM-DD HH:mm:ss". */
export const toApiDateTime = (date: Date): string =>
  date.toISOString().slice(0, 19).replace("T", " ");

/** Dates without an explicit offset come from the database in UTC. */
export const parseApiDate = (value: string): Date => {
  const normalized = value.replace(" ", "T");
  return new Date(
    /(Z|[+-]\d{2}:?\d{2})$/.test(normalized) ? normalized : `${normalized}Z`,
  );
};

export const differsFromParis = (date: Date): boolean =>
  parisOffsetMs(date) !== -date.getTimezoneOffset() * 60_000;

export const formatParisTime = (date: Date): string =>
  new Intl.DateTimeFormat("fr-FR", {
    timeZone: PARIS_TIME_ZONE,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(date);
