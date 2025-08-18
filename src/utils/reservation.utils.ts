import type { User } from "@/dto";
import type {
  GetReservation,
  PersonalReservationItem,
} from "@/dto/reservation";
import { formatDateTime } from "@/utils/date.utils";

export interface ReservationDisplayItem {
  id: number;
  name: string;
  type: "category" | "item";
  slot?: boolean;
  user?: User;
}

export interface GroupedReservations<T = PersonalReservationItem> {
  [date: string]: T[];
}

/**
 * Formats a Date object into YYYY-MM-DD format for grouping.
 */
export const toDateKey = (date: Date): string => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};

/**
 * Converts ISO string to hour format (e.g., "14h30").
 */
export const toHourString = (isoString: string): string => {
  const date = new Date(isoString);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}h${minutes}`;
};

/**
 * Formats a date range with localized full date-time.
 * Format: "DD MMM YYYY HHhMM - DD MMM YYYY HHhMM"
 */
export const formatDateTimeRange = (startDate: Date, endDate: Date): string => {
  return `${formatDateTime(startDate)} - ${formatDateTime(endDate)}`;
};

/**
 * Formats a time range (same day, time only).
 * Format: "HHhMM - HHhMM"
 */
export const formatTimeRange = (startDate: string, endDate: string): string => {
  return `${toHourString(startDate)} - ${toHourString(endDate)}`;
};

/**
 * Groups reservations by date.
 */
export const groupReservationsByDate = <T extends PersonalReservationItem>(
  items: T[],
): GroupedReservations<T> => {
  return items.reduce<GroupedReservations<T>>((acc, item) => {
    const dateKey = toDateKey(new Date(item.start_date));
    acc[dateKey] = acc[dateKey] ? [...acc[dateKey], item] : [item];
    return acc;
  }, {});
};

/**
 * Sorts items by start date.
 */
export const sortByStartDate = <T extends PersonalReservationItem>(
  items: T[],
  direction: "asc" | "desc" = "asc",
): T[] => {
  return [...items].sort((a, b) => {
    const dateA = new Date(a.start_date).getTime();
    const dateB = new Date(b.start_date).getTime();
    return direction === "asc" ? dateA - dateB : dateB - dateA;
  });
};

/**
 * Splits reservations into slot and non-slot items.
 */
export const splitReservationsBySlot = <T extends PersonalReservationItem>(
  items: T[],
): { slotItems: T[]; nonSlotItems: T[] } => {
  return {
    slotItems: items.filter((item) => item.slot),
    nonSlotItems: items.filter((item) => !item.slot),
  };
};

/**
 * Converts API response to display items for UI components.
 */
export const transformToDisplayItems = (
  data: GetReservation | undefined,
): ReservationDisplayItem[] => {
  const items: ReservationDisplayItem[] = [];

  // Add categories
  data?.categories?.forEach((category) => {
    items.push({
      id: category.id,
      name: category.name,
      type: "category",
    });
  });

  // Add items
  data?.items?.forEach((item) => {
    items.push({
      id: item.id,
      name: item.name,
      type: "item",
      slot: item.slot,
      user: item.user,
    });
  });

  return items;
};

/**
 * Generates a unique key for reservation items to avoid React key conflicts.
 */
export const generateReservationKey = (
  item: PersonalReservationItem,
  prefix?: string,
): string => {
  const base = `${item.id}-${item.start_date}`;
  return prefix ? `${prefix}-${base}` : base;
};

/**
 * Checks if a reservation item has an end date.
 */
export const hasEndDate = (item: PersonalReservationItem): boolean => {
  return item.end_date !== null && item.end_date !== undefined;
};

/**
 * Gets the appropriate action button type for a reservation.
 */
export const getReservationAction = (
  item: PersonalReservationItem,
): "cancel" | "return" => {
  return item.slot ? "cancel" : "return";
};
