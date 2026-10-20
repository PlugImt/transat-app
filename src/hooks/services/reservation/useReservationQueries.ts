import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  type CatalogScope,
  getItemSchedule,
  getMyReservations,
  getMyWaitlist,
  getReservationCatalog,
  searchReservationCatalog,
} from "@/api/endpoints/reservation/reservation.endpoint";
import { QUERY_KEYS } from "@/constants";
import type { MyReservationsFilter } from "@/dto/reservation";

export const useReservationCatalog = (scope: CatalogScope = {}) =>
  useQuery({
    queryKey: QUERY_KEYS.reservation.catalog(scope),
    queryFn: () => getReservationCatalog(scope),
  });

export const useReservationSearch = (query: string) =>
  useQuery({
    queryKey: QUERY_KEYS.reservation.search(query),
    queryFn: () => searchReservationCatalog(query),
    enabled: query.length > 0,
    placeholderData: keepPreviousData,
  });

/** Reservations of one item around a Paris calendar day (YYYY-MM-DD). */
export const useItemSchedule = (itemId: number, ymd: string) =>
  useQuery({
    queryKey: QUERY_KEYS.reservation.schedule(itemId, ymd),
    queryFn: () => getItemSchedule(itemId, ymd),
    staleTime: 1000 * 30,
  });

/** Where the user stands in the queues of items and slots that were reserved when they asked to be alerted. */
export const useMyWaitlist = (options?: { enabled?: boolean }) =>
  useQuery({
    queryKey: QUERY_KEYS.reservation.waitlist,
    queryFn: getMyWaitlist,
    staleTime: 1000 * 30,
    enabled: options?.enabled ?? true,
  });

export const useMyReservations = (
  filter: MyReservationsFilter,
  options?: { enabled?: boolean },
) =>
  useQuery({
    queryKey: QUERY_KEYS.reservation.my(filter),
    queryFn: () => getMyReservations(filter),
    enabled: options?.enabled ?? true,
  });
