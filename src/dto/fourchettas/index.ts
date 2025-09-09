import { z } from "zod";

export const orderSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1),
  firstname: z.string().min(1),
  phone: z.string().min(10),
  event_id: z.number().int().positive(),
  dish_id: z.number().int().nonnegative(),
  side_id: z.number().int().nonnegative(),
  drink_id: z.number().int().nonnegative(),
  created_at: z.string().min(10),
  prepared: z.boolean(),
  delivered: z.boolean(),
  price: z.number().nonnegative().optional(),
});

export const eventSchema = z.object({
  id: z.number().int().positive(),
  title: z.string().min(1),
  description: z.string().min(1),
  date: z.string().min(10),
  time: z.string().min(5),
  form_closing_date: z.string().min(10),
  form_closing_time: z.string().min(5),
  img_url: z.string().url(),
  deleting: z.boolean().optional(),
  orderuser: orderSchema.optional(),
});

export const itemSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1),
  description: z.string().min(1),
  price: z.number().nonnegative(),
  type: z.string().min(1),
  quantity: z.number().int().nonnegative(),
  img_url: z.string().url(),
  event_id: z.number().int().positive(),
});

export type Order = z.infer<typeof orderSchema>;
export type Event = z.infer<typeof eventSchema>;
export type Item = z.infer<typeof itemSchema>;
