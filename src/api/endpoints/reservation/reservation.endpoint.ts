import { API_ROUTES } from "@/api/common";
import { Method } from "@/api/enums";
import { apiRequest } from "@/api/helpers";
import type {
  ItemSchedule,
  ItemScheduleResponse,
  JoinWaitlistResponse,
  LeaveWaitlistResponse,
  MyReservations,
  MyReservationsFilter,
  MyReservationsResponse,
  ReservationCatalog,
  ReservationCatalogResponse,
  WaitlistEntry,
  WaitlistResponse,
} from "@/dto/reservation";
import { toApiDateTime } from "@/utils/reservation-time";

export type CatalogScope = { categoryId?: number; clubId?: number };

const toCatalog = (
  response: ReservationCatalogResponse,
): ReservationCatalog => ({
  categories: response.categories ?? [],
  items: response.items ?? [],
});

export const getReservationCatalog = async ({
  categoryId,
  clubId,
}: CatalogScope = {}): Promise<ReservationCatalog> => {
  const route =
    categoryId !== undefined
      ? API_ROUTES.reservationCategory.replace(":id", String(categoryId))
      : clubId !== undefined
        ? API_ROUTES.reservationClub.replace(":id", String(clubId))
        : API_ROUTES.reservation;

  return toCatalog(
    await apiRequest<ReservationCatalogResponse>(route, Method.GET),
  );
};

export const searchReservationCatalog = async (
  query: string,
): Promise<ReservationCatalog> =>
  toCatalog(
    await apiRequest<ReservationCatalogResponse>(
      `${API_ROUTES.reservationSearch}?q=${encodeURIComponent(query)}`,
      Method.GET,
    ),
  );

/** `ymd` is the day the schedule is centred on; the API also returns its neighbours. */
export const getItemSchedule = async (
  itemId: number,
  ymd: string,
): Promise<ItemSchedule> => {
  const response = await apiRequest<ItemScheduleResponse>(
    `${API_ROUTES.reservationItem.replace(":id", String(itemId))}?date=${ymd}`,
    Method.GET,
  );

  const unique = new Map<string, ItemSchedule["reservations"][number]>();
  for (const slot of [
    ...(response.reservation_before ?? []),
    ...(response.reservation ?? []),
    ...(response.reservation_after ?? []),
  ]) {
    unique.set(`${slot.start_date}|${slot.user.email}`, slot);
  }

  return {
    id: response.id,
    name: response.name,
    slot: response.slot,
    warningMessage: response.warning_message,
    confirmationMessage: response.confirmation_message,
    reservations: [...unique.values()],
  };
};

export const getMyReservations = async (
  filter: MyReservationsFilter,
): Promise<MyReservations> => {
  const response = await apiRequest<MyReservationsResponse>(
    `${API_ROUTES.reservationMy}?time=${filter}`,
    Method.GET,
  );
  return { current: response.current ?? [], past: response.past ?? [] };
};

const itemRoute = (itemId: number) =>
  API_ROUTES.reservationItem.replace(":id", String(itemId));

export const reserveSlot = (itemId: number, start: Date) =>
  apiRequest(itemRoute(itemId), Method.PATCH, {
    start_date: toApiDateTime(start),
  });

export const cancelSlot = (itemId: number, start: Date) =>
  apiRequest(itemRoute(itemId), Method.DELETE, {
    start_date: toApiDateTime(start),
  });

export const takeItem = (itemId: number) =>
  apiRequest(itemRoute(itemId), Method.PATCH, {
    start_date: toApiDateTime(new Date()),
  });

export const returnItem = (itemId: number) =>
  apiRequest(itemRoute(itemId), Method.PATCH, {
    end_date: toApiDateTime(new Date()),
  });

const waitlistRoute = (itemId: number) =>
  API_ROUTES.reservationItemWaitlist.replace(":id", String(itemId));

/** The slot is named for slot items only; an item without slot has a single queue. */
const waitlistBody = (start?: Date) =>
  start ? { start_date: toApiDateTime(start) } : undefined;

export const getMyWaitlist = async (): Promise<WaitlistEntry[]> => {
  const response = await apiRequest<WaitlistResponse>(
    API_ROUTES.reservationWaitlist,
    Method.GET,
  );
  return response.waitlist ?? [];
};

export const joinWaitlist = (itemId: number, start?: Date) =>
  apiRequest<JoinWaitlistResponse>(
    waitlistRoute(itemId),
    Method.POST,
    waitlistBody(start),
  );

export const leaveWaitlist = (itemId: number, start?: Date) =>
  apiRequest<LeaveWaitlistResponse>(
    waitlistRoute(itemId),
    Method.DELETE,
    waitlistBody(start),
  );

/** "Réserver" of the waiting list: books at once, 409 `not_available` when someone was faster. */
export const reserveFromWaitlist = (itemId: number, start?: Date) =>
  apiRequest(
    `${waitlistRoute(itemId)}/reserve`,
    Method.POST,
    waitlistBody(start),
  );

/** "Annuler" of the waiting list: leaves the queue and passes the turn to the next person. */
export const declineWaitlist = (itemId: number, start?: Date) =>
  apiRequest<LeaveWaitlistResponse>(
    `${waitlistRoute(itemId)}/decline`,
    Method.POST,
    waitlistBody(start),
  );
