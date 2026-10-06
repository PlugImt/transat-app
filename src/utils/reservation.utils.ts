import type {
  MyReservation,
  ReservationCatalog,
  ReservationCategory,
  ReservationItem,
  ReservationUser,
  ReservedSlot,
} from "@/dto/reservation";
import { toYYYYMMDD } from "@/utils/date.utils";
import { buildDaySlots, parseApiDate } from "@/utils/reservation-time";

const sameEmail = (a?: string, b?: string) =>
  !!a && !!b && a.toLowerCase() === b.toLowerCase();

export type ItemAvailability = "slot" | "free" | "mine" | "taken";

export const getItemAvailability = (
  item: ReservationItem,
  myEmail?: string,
): ItemAvailability => {
  if (item.slot) return "slot";
  if (!item.user) return "free";
  return sameEmail(item.user.email, myEmail) ? "mine" : "taken";
};

export type CatalogRow =
  | { type: "header"; section: "categories" | "items" }
  | { type: "category"; category: ReservationCategory }
  | { type: "item"; item: ReservationItem; availability: ItemAvailability };

export const buildCatalogRows = (
  catalog: ReservationCatalog,
  options: { myEmail?: string },
): CatalogRow[] => {
  const items = catalog.items.map((item) => ({
    item,
    availability: getItemAvailability(item, options.myEmail),
  }));

  const rows: CatalogRow[] = [];

  if (catalog.categories.length > 0) {
    rows.push({ type: "header", section: "categories" });
    for (const category of catalog.categories) {
      rows.push({ type: "category", category });
    }
  }

  if (items.length > 0) {
    rows.push({ type: "header", section: "items" });
    for (const { item, availability } of items) {
      rows.push({ type: "item", item, availability });
    }
  }

  return rows;
};

export type SlotStatus = "free" | "mine" | "taken";

export interface DaySlotView {
  key: string;
  start: Date;
  end: Date;
  status: SlotStatus;
  user?: ReservationUser;
  /** Slot has already ended: it can't be booked or cancelled anymore. */
  isPast: boolean;
}

export const buildDayView = (
  ymd: string,
  reservations: ReservedSlot[],
  myEmail: string | undefined,
  now: Date,
): DaySlotView[] => {
  const parsed = reservations.map((reservation) => ({
    start: parseApiDate(reservation.start_date),
    end: parseApiDate(reservation.end_date),
    user: reservation.user,
  }));

  return buildDaySlots(ymd).map(({ start, end }) => {
    const reservation = parsed.find((r) => r.start < end && r.end > start);
    const status: SlotStatus = !reservation
      ? "free"
      : sameEmail(reservation.user.email, myEmail)
        ? "mine"
        : "taken";

    return {
      key: start.toISOString(),
      start,
      end,
      status,
      user: reservation?.user,
      isPast: end <= now,
    };
  });
};

export const formatUserName = (user: ReservationUser) =>
  `${user.first_name} ${user.last_name}`.trim();

export interface ReservationDayGroup {
  /** Day in the device time zone, YYYY-MM-DD. */
  day: string;
  /** Any instant of that day, to format the heading. */
  date: Date;
  items: MyReservation[];
}

/** Merges back-to-back slots (sorted by start) into continuous ranges. */
export const mergeContiguousSlots = (
  slots: { start: Date; end: Date }[],
): { start: Date; end: Date }[] => {
  const ranges: { start: Date; end: Date }[] = [];

  for (const slot of slots) {
    const last = ranges[ranges.length - 1];
    if (last && last.end.getTime() === slot.start.getTime()) {
      last.end = slot.end;
    } else {
      ranges.push({ start: slot.start, end: slot.end });
    }
  }

  return ranges;
};

/** Groups reservations by day in the device time zone, in the order given. */
export const groupByLocalDay = (
  items: MyReservation[],
): ReservationDayGroup[] => {
  const groups = new Map<string, ReservationDayGroup>();

  for (const item of items) {
    const date = parseApiDate(item.start_date);
    const day = toYYYYMMDD(date);
    const group = groups.get(day);
    if (group) {
      group.items.push(item);
    } else {
      groups.set(day, { day, date, items: [item] });
    }
  }

  return [...groups.values()];
};

export const sortByStart = (
  items: MyReservation[],
  direction: "asc" | "desc",
): MyReservation[] =>
  [...items].sort((a, b) => {
    const delta =
      parseApiDate(a.start_date).getTime() -
      parseApiDate(b.start_date).getTime();
    return direction === "asc" ? delta : -delta;
  });

export const reservationKey = (item: MyReservation) =>
  `${item.id}-${item.start_date}`;

/** Rows the widget may render; the card clips and fades the ones beyond its height. */
export const WIDGET_MAX_ROWS = 4;
/** Rows kept for items held the longest, so a long-forgotten one is never buried. */
const WIDGET_HELD_QUOTA = 2;

/** Reservations still relevant: items not returned yet, and slots that haven't ended. */
export const getActiveReservations = (
  current: MyReservation[],
  now: Date,
): MyReservation[] =>
  current.filter(
    (reservation) =>
      !reservation.slot ||
      (!!reservation.end_date && parseApiDate(reservation.end_date) > now),
  );

/**
 * Picks the few current reservations worth showing in a compact widget: the items
 * held for the longest time first, then the next upcoming slots.
 */
export const pickWidgetReservations = (
  current: MyReservation[],
): MyReservation[] => {
  const held = sortByStart(
    current.filter((reservation) => !reservation.slot),
    "asc",
  );
  const slots = mergeAdjacentReservations(
    sortByStart(
      current.filter((reservation) => reservation.slot),
      "asc",
    ),
  );

  let heldCount = Math.min(held.length, WIDGET_HELD_QUOTA);
  const slotCount = Math.min(slots.length, WIDGET_MAX_ROWS - heldCount);
  heldCount = Math.min(held.length, WIDGET_MAX_ROWS - slotCount);

  return [...held.slice(0, heldCount), ...slots.slice(0, slotCount)];
};

/** Merges back-to-back slots of the same item (sorted by start) into one reservation. */
const mergeAdjacentReservations = (slots: MyReservation[]): MyReservation[] => {
  const merged: MyReservation[] = [];

  for (const slot of slots) {
    const previous = merged.findLast(
      (reservation) => reservation.id === slot.id,
    );
    if (
      previous?.end_date &&
      parseApiDate(previous.end_date).getTime() ===
        parseApiDate(slot.start_date).getTime()
    ) {
      previous.end_date = slot.end_date;
    } else {
      merged.push({ ...slot });
    }
  }

  return merged;
};
