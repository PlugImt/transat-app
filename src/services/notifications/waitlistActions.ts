import { notificationNavigationSchema } from "@/dto/notification";
import { notificationLog } from "@/services/notifications/log";
import {
  getWaitlistErrorCode,
  getWaitlistErrorKey,
} from "@/utils/reservation.utils";
import { parseApiDate } from "@/utils/reservation-time";
import { type RouteTarget, servicesRoute } from "./navigation/route-target";

/** Interactive category the backend asks the phone to use for a released item or slot (`categoryId`). */
export const WAITLIST_CATEGORY = "reservation_waitlist";

export const WAITLIST_ACTIONS = {
  reserve: "waitlist_reserve",
  decline: "waitlist_decline",
} as const;

export type WaitlistActionId =
  (typeof WAITLIST_ACTIONS)[keyof typeof WAITLIST_ACTIONS];

export const isWaitlistAction = (
  identifier: string,
): identifier is WaitlistActionId =>
  identifier === WAITLIST_ACTIONS.reserve ||
  identifier === WAITLIST_ACTIONS.decline;

/** What a waiting list notification offers: the item, and the slot for a slot item. */
export type WaitlistOffer = { itemId: number; start?: Date };

const parseJson = (value: unknown) => {
  if (typeof value !== "string") return value;
  try {
    return JSON.parse(value);
  } catch {
    return undefined;
  }
};

/**
 * Reads the offer from the push `data`: `navigation = { type: "reservation", id, params: { waitlist: "1", start?, date? } }`.
 * A slot offer always names its slot (`date` and `start` go together), and null is returned when it does not.
 */
export const parseWaitlistOffer = (data: unknown): WaitlistOffer | null => {
  if (!data || typeof data !== "object") return null;
  const parsed = notificationNavigationSchema.safeParse(
    parseJson((data as { navigation?: unknown }).navigation),
  );
  if (!parsed.success) return null;

  const { type, id, params } = parsed.data;
  const itemId = Number(id);
  if (type !== "reservation" || params?.waitlist !== "1") return null;
  if (!Number.isInteger(itemId) || itemId <= 0) return null;

  if (params.start === undefined) {
    return params.date === undefined ? { itemId } : null;
  }
  const start = parseApiDate(params.start);
  return Number.isNaN(start.getTime()) ? null : { itemId, start };
};

type MessageKey =
  | NonNullable<ReturnType<typeof getWaitlistErrorKey>>
  | "services.reservation.reserveSuccess"
  | "services.reservation.errors.reserveError"
  | "services.reservation.waitlist.declined"
  | "services.reservation.waitlist.errors.leaveError";

export type WaitlistActionDeps = {
  reserve: (itemId: number, start?: Date) => Promise<unknown>;
  decline: (itemId: number, start?: Date) => Promise<unknown>;
  /** Refreshes what the reservation screens show; runs whatever the outcome. */
  refresh: () => Promise<unknown> | undefined;
  notify: (message: string, tone: "success" | "destructive") => void;
  translate: (key: MessageKey) => string;
  navigate: (target: RouteTarget) => void;
  /** False once a newer tap, or the navigator going away, made this one obsolete. */
  isCurrent: () => boolean;
};

export type WaitlistActionOutcome =
  | "reserved"
  | "declined"
  /** Somebody booked it first: first come, first served. */
  | "conflict"
  | "failed"
  | "invalid";

/**
 * Runs a button of the waiting list notification. "Réserver" books at once and says so; if somebody was faster
 * the user is told it is gone, and keeps their place. "Annuler" leaves the queue, which makes the backend tell
 * the next person.
 */
export const runWaitlistAction = async (
  action: WaitlistActionId,
  data: unknown,
  deps: WaitlistActionDeps,
): Promise<WaitlistActionOutcome> => {
  const offer = parseWaitlistOffer(data);
  if (!offer) {
    notificationLog.warn(
      "waiting list action without a usable offer",
      undefined,
      {
        action,
      },
    );
    deps.notify(
      deps.translate(
        action === WAITLIST_ACTIONS.reserve
          ? "services.reservation.errors.reserveError"
          : "services.reservation.waitlist.errors.leaveError",
      ),
      "destructive",
    );
    return "invalid";
  }

  const reserving = action === WAITLIST_ACTIONS.reserve;
  try {
    if (reserving) {
      await deps.reserve(offer.itemId, offer.start);
      deps.notify(
        deps.translate("services.reservation.reserveSuccess"),
        "success",
      );
      if (deps.isCurrent()) deps.navigate(servicesRoute("MyReservations"));
      return "reserved";
    }
    await deps.decline(offer.itemId, offer.start);
    deps.notify(
      deps.translate("services.reservation.waitlist.declined"),
      "success",
    );
    return "declined";
  } catch (error) {
    const key =
      getWaitlistErrorKey(error) ??
      (reserving
        ? "services.reservation.errors.reserveError"
        : "services.reservation.waitlist.errors.leaveError");
    deps.notify(deps.translate(key), "destructive");
    notificationLog.info("waiting list action failed", {
      action,
      code: getWaitlistErrorCode(error),
    });
    return reserving && getWaitlistErrorCode(error) === "not_available"
      ? "conflict"
      : "failed";
  } finally {
    await deps.refresh();
  }
};
