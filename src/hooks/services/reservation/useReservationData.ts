import { useMemo } from "react";
import type { User } from "@/dto";
import type { GetReservation } from "@/dto/reservation";

type ReservationItem = {
  id: number;
  name: string;
  type: "category" | "item";
  slot?: boolean;
  user?: User;
};

export const useReservationData = (
  data: GetReservation[] | GetReservation | undefined,
): ReservationItem[] => {
  return useMemo(() => {
    const reservation = Array.isArray(data) ? data[0] : data;
    if (!reservation) return [];

    const mergedData: ReservationItem[] = [
      ...(reservation.categories?.map((c) => ({
        ...c,
        type: "category" as const,
      })) || []),
      ...(reservation.items?.map((i) => ({ ...i, type: "item" as const })) ||
        []),
    ];

    return mergedData;
  }, [data]);
};
