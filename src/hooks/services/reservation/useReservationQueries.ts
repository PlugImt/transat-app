import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  type CatalogScope,
  getItemSchedule,
  getMyReservations,
  getMyWaitlist,
  getReservationCatalog,
  searchReservationCatalog,
} from "@/api/endpoints/reservation/reservation.endpoint";
import { LIVE_POLL_INTERVAL } from "@/api/query-client";
import { QUERY_KEYS } from "@/constants";
import type { MyReservationsFilter } from "@/dto/reservation";

export const useReservationCatalog = (scope: CatalogScope = {}) =>
  useQuery({
    queryKey: QUERY_KEYS.reservation.catalog(scope),
    queryFn: () => getReservationCatalog(scope),
    refetchInterval: LIVE_POLL_INTERVAL,
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
    refetchInterval: LIVE_POLL_INTERVAL,
  });

/** Where the user stands in the queues of items and slots that were reserved when they asked to be alerted. */
export const useMyWaitlist = (options?: { enabled?: boolean }) =>
  useQuery({
    queryKey: QUERY_KEYS.reservation.waitlist,
    queryFn: getMyWaitlist,
    refetchInterval: LIVE_POLL_INTERVAL,
    enabled: options?.enabled ?? true,
  });

export const useMyReservations = (
  filter: MyReservationsFilter,
  options?: { enabled?: boolean },
) =>
  useQuery({
    queryKey: QUERY_KEYS.reservation.my(filter),
    queryFn: () => getMyReservations(filter),
    refetchInterval: LIVE_POLL_INTERVAL,
    enabled: options?.enabled ?? true,
  });
