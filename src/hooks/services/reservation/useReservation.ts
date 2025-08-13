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

export const useReservations = () => {
  const { data, isPending, refetch, isError, error } = useQuery({
    queryKey: ["reservation", "root"],
    queryFn: () => getReservationRoot(),
  });

  return { data, isPending, refetch, isError, error };
};

export const useReservationCategories = (id: number) => {
  const { data, isPending, refetch, isError, error } = useQuery({
    queryKey: [...QUERY_KEYS.reservation.categories, id],
    queryFn: () => getReservationCategories(id),
  });

  return { data, isPending, refetch, isError, error };
};

export const useReservationClub = (id: number) => {
  const { data, isPending, refetch, isError, error } = useQuery({
    queryKey: QUERY_KEYS.reservation.club(id),
    queryFn: () => getReservationClub(id),
  });

  return { data, isPending, refetch, isError, error };
};

export const useReservationItem = (id: number, date = "") => {
  const { data, isPending, refetch, isError, error } = useQuery({
    queryKey: ["reservationItem", id, date],
    queryFn: () => getReservationItem(id, date),
  });

  return { data, isPending, refetch, isError, error };
};

export const useMyReservations = (time?: "all" | "past" | "current") => {
  const { data, isPending, refetch, isError, error } = useQuery({
    queryKey: QUERY_KEYS.reservation.my(time),
    queryFn: () => getMyReservations(time),
  });
  return { data, isPending, refetch, isError, error };
};

export const useSearchReservations = (q: string) => {
  const { data, isPending, refetch, isError, error } = useQuery({
    queryKey: QUERY_KEYS.reservation.search(q),
    queryFn: () => searchReservations(q),
    enabled: q.length > 0,
  });
  return { data, isPending, refetch, isError, error };
};
