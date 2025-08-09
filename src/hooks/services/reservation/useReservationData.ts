import { useMemo } from "react";
import type { GetReservation } from "@/dto/reservation";

type ReservationItem = {
  id: number;
  name: string;
  type: "category" | "item";
  slot?: boolean;
};

export const useReservationData = (data: GetReservation[] | GetReservation | undefined): ReservationItem[] => {
  return useMemo(() => {
    const dataObj = Array.isArray(data) ? data[0] : data;
    
    if (!dataObj) return [];

    const combinedData: ReservationItem[] = [
      ...(dataObj.categories?.map((category: { id: number; name: string }) => ({
        ...category,
        type: "category" as const,
      })) || []),
      ...(dataObj.items?.map((item: { id: number; name: string; slot: boolean }) => ({
        ...item,
        type: "item" as const,
      })) || []),
    ];

    return combinedData;
  }, [data]);
};
