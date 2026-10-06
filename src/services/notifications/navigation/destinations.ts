import type { QueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { getClubDetails } from "@/api/endpoints/club/club.endpoint";
import { getEventDetails } from "@/api/endpoints/event/event.endpoint";
import { getItemSchedule } from "@/api/endpoints/reservation/reservation.endpoint";
import { QUERY_KEYS } from "@/constants";
import { getParisYmd } from "@/utils/reservation-time";
import {
  type ParameterlessScreen,
  type RouteTarget,
  servicesRoute,
} from "./route-target";

export interface ResolvedDestination {
  /** Best-effort route, used as soon as the payload is understood. */
  target: RouteTarget;
  /** Opened instead when `check` finds the entity gone. */
  fallback?: RouteTarget;
  /** Verifies the entity and may refine the route; rejects with an ApiError when it is gone. */
  check?: (queryClient: QueryClient) => Promise<RouteTarget | undefined>;
}

/** Turns a navigation payload into a destination, or null when the payload is invalid for this type. */
export type DestinationResolver = (
  navigation: unknown,
) => ResolvedDestination | null;

type DestinationDefinition<S extends z.ZodType> = {
  /** Validates the navigation payload (`id`, `params`) this destination needs. */
  schema: S;
  target: (navigation: z.output<S>) => RouteTarget;
  check?: (
    navigation: z.output<S>,
    queryClient: QueryClient,
  ) => Promise<RouteTarget | undefined>;
  fallback?: RouteTarget;
};

const defineDestination =
  <S extends z.ZodType>({
    schema,
    target,
    check,
    fallback,
  }: DestinationDefinition<S>): DestinationResolver =>
  (navigation) => {
    const parsed = schema.safeParse(navigation);
    if (!parsed.success) return null;

    const data = parsed.data;
    return {
      target: target(data),
      fallback,
      check: check && ((queryClient) => check(data, queryClient)),
    };
  };

const CHECK_STALE_TIME = 30_000;

const entityId = z.coerce.number().int().positive();
const ymd = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

/** Services whose landing page can be opened by key through the `service` destination. */
const SERVICE_SCREENS = {
  laundry: "Laundry",
  timetable: "Timetable",
  homework: "Homework",
  clubs: "Clubs",
  events: "Events",
  traq: "Traq",
  reservations: "Reservation",
  my_reservations: "MyReservations",
  fourchettas: "Fourchettas",
} as const satisfies Record<string, ParameterlessScreen>;

type ServiceKey = keyof typeof SERVICE_SCREENS;

const serviceKey = z.custom<ServiceKey>(
  (value) => typeof value === "string" && Object.hasOwn(SERVICE_SCREENS, value),
);

/**
 * Registry of notification destinations, keyed by the backend `NavigationType`.
 * Adding a destination is one entry here (plus the type on the backend).
 */
export const DESTINATIONS: Record<string, DestinationResolver> = {
  event: defineDestination({
    schema: z.object({ id: entityId }),
    target: ({ id }) => servicesRoute("EventDetails", { id }),
    check: async ({ id }, queryClient) => {
      await queryClient.fetchQuery({
        queryKey: [...QUERY_KEYS.event.eventDetails, id],
        queryFn: () => getEventDetails(id),
        staleTime: CHECK_STALE_TIME,
      });
      return undefined;
    },
    fallback: servicesRoute("Events"),
  }),

  club: defineDestination({
    schema: z.object({ id: entityId }),
    target: ({ id }) => servicesRoute("ClubDetails", { id }),
    check: async ({ id }, queryClient) => {
      await queryClient.fetchQuery({
        queryKey: [...QUERY_KEYS.club.clubDetails, id],
        queryFn: () => getClubDetails(id),
        staleTime: CHECK_STALE_TIME,
      });
      return undefined;
    },
    fallback: servicesRoute("Clubs"),
  }),

  restaurant: defineDestination({
    schema: z.object({}),
    target: () => servicesRoute("Restaurant"),
  }),

  reservation: defineDestination({
    schema: z.object({
      id: entityId,
      params: z
        .object({ date: ymd.optional(), title: z.string().optional() })
        .optional(),
    }),
    target: ({ id, params }) =>
      servicesRoute("ReservationCalendar", {
        id,
        title: params?.title,
        date: params?.date,
      }),
    check: async ({ id, params }, queryClient) => {
      const date = params?.date ?? getParisYmd(new Date());
      const item = await queryClient.fetchQuery({
        queryKey: QUERY_KEYS.reservation.schedule(id, date),
        queryFn: () => getItemSchedule(id, date),
        staleTime: CHECK_STALE_TIME,
      });
      // Only slot items have a calendar; take/return items live in the user's reservation list.
      return item.slot ? undefined : servicesRoute("MyReservations");
    },
    fallback: servicesRoute("Reservation"),
  }),

  service: defineDestination({
    schema: z.object({ id: serviceKey }),
    target: ({ id }) => servicesRoute(SERVICE_SCREENS[id]),
  }),
};
