import { useMemo } from "react";
import type {
  GroupedReservations,
  MyReservationItem,
  ReservationDisplayItem,
  ReservationListResponse,
} from "@/types/reservation.types";
import {
  groupReservationsByDate,
  sortByStartDate,
  splitReservationsBySlot,
  transformToDisplayItems,
} from "@/utils/reservation.utils";

export const useReservationDisplayData = (
  data: ReservationListResponse | ReservationListResponse[] | undefined,
): ReservationDisplayItem[] => {
  return useMemo(() => {
    if (!data) return [];

    if (Array.isArray(data)) {
      const allCategories = data.flatMap((item) => item.categories || []);
      const allItems = data.flatMap((item) => item.items || []);
      return transformToDisplayItems({
        categories: allCategories,
        items: allItems,
      });
    }

    return transformToDisplayItems(data);
  }, [data]);
};

export const useMyReservationData = (
  items: MyReservationItem[],
  type: "current" | "past",
) => {
  return useMemo(() => {
    if (!items?.length) {
      return {
        slotItems: [],
        nonSlotItems: [],
        groupedSlotItems: {},
        orderedDays: [],
      };
    }

    const sortDirection = type === "current" ? "asc" : "desc";
    const sortedItems = sortByStartDate(items, sortDirection);
    const { slotItems, nonSlotItems } = splitReservationsBySlot(sortedItems);

    const groupedSlotItems = groupReservationsByDate(slotItems);
    const orderedDays = Object.keys(groupedSlotItems).sort((a, b) =>
      type === "current" ? a.localeCompare(b) : b.localeCompare(a),
    );

    return {
      slotItems,
      nonSlotItems: sortByStartDate(nonSlotItems, sortDirection),
      groupedSlotItems,
      orderedDays,
    };
  }, [items, type]);
};

export const useGroupedReservations = <T extends MyReservationItem>(
  items: T[],
  sortDirection: "asc" | "desc" = "asc",
): {
  grouped: GroupedReservations<T>;
  orderedDays: string[];
} => {
  return useMemo(() => {
    const grouped = groupReservationsByDate(items);
    const orderedDays = Object.keys(grouped).sort((a, b) =>
      sortDirection === "asc" ? a.localeCompare(b) : b.localeCompare(a),
    );

    return { grouped, orderedDays };
  }, [items, sortDirection]);
};
