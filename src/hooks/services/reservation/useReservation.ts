import { useQuery } from "@tanstack/react-query";
import {
  getReservationCategories,
  getReservationClub,
  getReservationItem,
  getReservationRoot,
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

export const userReservationItem = (id: number) => {
  const { data, isPending, refetch, isError, error } = useQuery({
    queryKey: QUERY_KEYS.reservation.items,
    queryFn: () => getReservationItem(id),
  });

  return { data, isPending, refetch, isError, error };
};
