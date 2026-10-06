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
