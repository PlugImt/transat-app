import { z } from "zod";
import { userSchema } from "@/dto/user";

export const getReservationSchema = z.object({
  categories: z
    .array(
      z.object({
        id: z.number(),
        name: z.string(),
      }),
    )
    .optional(),
  items: z
    .array(
      z.object({
        id: z.number(),
        name: z.string(),
        slot: z.boolean(),
      }),
    )
    .optional(),
});

export const reservationSchema = z.object({
  id: z.number(),
  start_date: z.string(),
  end_date: z.string(),
  user: userSchema,
});

export const reservationDetailsSchema = z.object({
  item: z.object({
    id: z.number(),
    name: z.string(),
    slot: z.boolean(),
    reservation: z.array(reservationSchema.optional()),
    reservation_before: z.array(reservationSchema.optional()),
    reservation_after: z.array(reservationSchema.optional()),
  }),
});

export const createReservationCategory = z.object({
  name: z.string(),
  id_category_parent: z.number().optional(),
  id_club_parent: z.number().optional(),
});

export const createReservationItem = z.object({
  name: z.string(),
  slot: z.boolean().optional(),
  id_club_parent: z.number().optional(),
  id_category_parent: z.number().optional(),
});

export const manageReservation = z.object({
  start_date: z.string().optional(),
  end_date: z.string().optional(),
});

export type GetReservation = z.infer<typeof getReservationSchema>;
export type ReservationDetails = z.infer<typeof reservationDetailsSchema>;
export type CreateReservationCategory = z.infer<
  typeof createReservationCategory
>;
export type CreateReservationItem = z.infer<typeof createReservationItem>;
export type ManageReservation = z.infer<typeof manageReservation>;
