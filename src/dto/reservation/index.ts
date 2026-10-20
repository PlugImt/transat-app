import { z } from "zod";

export const reservationUserSchema = z.object({
  email: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  profile_picture: z.string().optional(),
});

export const reservationCategorySchema = z.object({
  id: z.number(),
  name: z.string(),
});

export const reservationItemSchema = z.object({
  id: z.number(),
  name: z.string(),
  /** Slot items are booked by the hour, the others are taken and returned. */
  slot: z.boolean(),
  /** Current holder, only present for taken items that are not slot-based. */
  user: reservationUserSchema.optional(),
  warning_message: z.string().optional(),
  confirmation_message: z.string().optional(),
});

/** Categories and items are null when empty. */
export const reservationCatalogResponseSchema = z.object({
  categories: z.array(reservationCategorySchema).nullable().optional(),
  items: z.array(reservationItemSchema).nullable().optional(),
});

export const reservedSlotSchema = z.object({
  /** Id of the reserved item, not of the reservation. */
  id: z.number(),
  start_date: z.string(),
  end_date: z.string(),
  user: reservationUserSchema,
});

/** Reservations are split around the requested day; null when empty. */
export const itemScheduleResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  slot: z.boolean(),
  reservation: z.array(reservedSlotSchema).nullable().optional(),
  reservation_before: z.array(reservedSlotSchema).nullable().optional(),
  reservation_after: z.array(reservedSlotSchema).nullable().optional(),
  warning_message: z.string().optional(),
  confirmation_message: z.string().optional(),
});

export const myReservationSchema = z.object({
  id: z.number(),
  name: z.string(),
  slot: z.boolean(),
  start_date: z.string(),
  /** Null while a non-slot item has not been returned. */
  end_date: z.string().nullable(),
});

export const myReservationsResponseSchema = z.object({
  current: z.array(myReservationSchema).nullable().optional(),
  past: z.array(myReservationSchema).nullable().optional(),
});

/** One place in a queue of interest, for an item without slot or for one slot. */
export const waitlistEntrySchema = z.object({
  item_id: z.number(),
  item_name: z.string(),
  slot: z.boolean(),
  /** UTC wall time of the slot, "YYYY-MM-DD HH:mm:ss"; absent for an item without slot. */
  start_date: z.string().optional(),
  /** 1 for the first of the queue. */
  position: z.number(),
  /** The resource was released and this user has been told, without answering yet. */
  notified: z.boolean(),
  joined_at: z.string(),
});

export const waitlistResponseSchema = z.object({
  waitlist: z.array(waitlistEntrySchema).nullable().optional(),
});

export const joinWaitlistResponseSchema = z.object({
  message: z.string(),
  position: z.number(),
});

export const leaveWaitlistResponseSchema = z.object({
  message: z.string(),
  next_notified: z.boolean(),
});

/** Stable `code` of the waiting list errors (HTTP 400, 404 and 409). */
export const waitlistErrorCodes = [
  "bad_request",
  "item_not_found",
  "start_required",
  "invalid_start",
  "still_available",
  "own_reservation",
  "already_queued",
  "queue_limit",
  "not_queued",
  "not_available",
] as const;

export type ReservationUser = z.infer<typeof reservationUserSchema>;
export type ReservationCategory = z.infer<typeof reservationCategorySchema>;
export type ReservationItem = z.infer<typeof reservationItemSchema>;
export type ReservedSlot = z.infer<typeof reservedSlotSchema>;
export type MyReservation = z.infer<typeof myReservationSchema>;
export type ReservationCatalogResponse = z.infer<
  typeof reservationCatalogResponseSchema
>;
export type ItemScheduleResponse = z.infer<typeof itemScheduleResponseSchema>;
export type MyReservationsResponse = z.infer<
  typeof myReservationsResponseSchema
>;
export type WaitlistEntry = z.infer<typeof waitlistEntrySchema>;
export type WaitlistResponse = z.infer<typeof waitlistResponseSchema>;
export type JoinWaitlistResponse = z.infer<typeof joinWaitlistResponseSchema>;
export type LeaveWaitlistResponse = z.infer<typeof leaveWaitlistResponseSchema>;
export type WaitlistErrorCode = (typeof waitlistErrorCodes)[number];

/** API responses with nulls replaced by empty lists. */
export type ReservationCatalog = {
  categories: ReservationCategory[];
  items: ReservationItem[];
};

export type ItemSchedule = {
  id: number;
  name: string;
  slot: boolean;
  warningMessage?: string;
  confirmationMessage?: string;
  /** Every reservation returned around the requested day, without duplicates. */
  reservations: ReservedSlot[];
};

export type MyReservations = {
  current: MyReservation[];
  past: MyReservation[];
};

export type MyReservationsFilter = "current" | "past";
