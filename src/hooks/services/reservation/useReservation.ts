import { useQuery } from "@tanstack/react-query";
import {
  getMyReservations,
  getReservationCategories,
  getReservationClub,
  getReservationItem,
  getReservationRoot,
  searchReservations,
} from "@/api";
import { QUERY_KEYS } from "@/constants";
import type {
  MyReservationsResponse,
  ReservationItemResponse,
  ReservationListResponse,
  ReservationTimeFilter,
} from "@/types/reservation.types";

export const useReservations = () => {
  const { data, isPending, refetch, isError, error } = useQuery({
    queryKey: QUERY_KEYS.reservation.categories,
    queryFn: getReservationRoot,
  });

  return { data, isPending, refetch, isError, error };
};

export const useReservationCategory = (categoryId: number) => {
  const { data, isPending, refetch, isError, error } = useQuery({
    queryKey: [...QUERY_KEYS.reservation.categories, categoryId],
    queryFn: () => getReservationCategories(categoryId),
  });

  return { data, isPending, refetch, isError, error };
};

export const useClubReservations = (clubId: number) => {
  const { data, isPending, refetch, isError, error } = useQuery({
    queryKey: QUERY_KEYS.reservation.club(clubId),
    queryFn: () => getReservationClub(clubId),
  });

  return { data, isPending, refetch, isError, error };
};

export const useReservationItem = (itemId: number, date?: string) => {
  const { data, isPending, refetch, isError, error } = useQuery({
    queryKey: QUERY_KEYS.reservation.item(itemId, date),
    queryFn: () => getReservationItem(itemId, date || ""),
  });

  return { data, isPending, refetch, isError, error };
};

export const useMyReservations = (
  timeFilter: ReservationTimeFilter = "current",
  options?: { enabled?: boolean },
) => {
  const { data, isPending, refetch, isError, error } =
    useQuery<MyReservationsResponse>({
      queryKey: QUERY_KEYS.reservation.my(timeFilter),
      queryFn: () => getMyReservations(timeFilter),
      enabled: options?.enabled ?? true,
    });

  return { data, isPending, refetch, isError, error };
};

export const useReservationSearch = (query: string) => {
  const { data, isPending, refetch, isError, error } = useQuery({
    queryKey: QUERY_KEYS.reservation.search(query),
    queryFn: () => searchReservations(query),
    enabled: query.trim().length > 0,
  });

  return { data, isPending, refetch, isError, error };
};
