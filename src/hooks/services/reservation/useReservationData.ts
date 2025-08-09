import { useMemo } from "react";
import type { GetReservation } from "@/dto/reservation";
import { User } from '@/dto';

type ReservationItem = {
  id: number;
  name: string;
  type: "category" | "item";
  slot?: boolean;
  user?: User
};

export const useReservationData = (
  data: GetReservation[] | GetReservation | undefined,
): ReservationItem[] => {
  return useMemo(() => {
    const dataObj = Array.isArray(data) ? data[0] : data;

    if (!dataObj) return [];

    const combinedData: ReservationItem[] = [
      ...(dataObj.categories?.map((category: { id: number; name: string }) => ({
        ...category,
        type: "category" as const,
      })) || []),
      ...(dataObj.items?.map(
        (item: any) => ({
          ...item,
          type: "item" as const,
        }),
      ) || []),
    ];

    return combinedData;
  }, [data]);
};
