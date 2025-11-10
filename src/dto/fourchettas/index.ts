import { z } from "zod";

export const orderedItem = z.object({
  id: z.number().int().positive(),
  ordered_quantity: z.number().int().nonnegative(),
});

export const orderSchema = z.object({
  event_id: z.number().int().positive(),
  name: z.string().min(1),
  firstname: z.string().min(1),
  phone: z.string().min(10),
  items: z.array(orderedItem).nonempty(),
});

export const updateOrderSchema = z.object({
  phone: z.string().min(10),
  event_id: z.number().int().positive(),
  items: z.array(orderedItem).nonempty(),
});

const eventSchema = z.object({
  id: z.number().int().positive(),
  title: z.string().min(1),
  description: z.string().min(1),
  date: z.string().min(10),
  time: z.string().min(5),
  form_closing_date: z.string().min(10),
  form_closing_time: z.string().min(5),
  img_url: z.string().url(),
  deleting: z.boolean().optional(),
  orderuser: z.array(orderedItem).nonempty().optional(),
});

const itemSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1),
  description: z.string().min(1),
  price: z.number().nonnegative(),
  type: z.string().min(1),
  quantity: z.number().int().nonnegative(),
  img_url: z.string().url(),
  event_id: z.number().int().positive(),
});

const typeSchema = z.object({
  name: z.string().min(1),
  order_index: z.number().int().min(0),
  is_required: z.boolean(),
});

export interface OrderedItem {
  id: number;
  ordered_quantity: number;
}

export interface orderData {
  phone: string;
  event_id: number;
  name: string;
  firstname: string;
  items: OrderedItem[];
}

export interface updateOrderData {
  phone: string;
  event_id: number;
  items: OrderedItem[];
}

export type FourchettasType = z.infer<typeof typeSchema>;
export type FourchettasOrder = z.infer<typeof orderSchema>;
export type FourchettasEvent = z.infer<typeof eventSchema>;
export type FourchettasItem = z.infer<typeof itemSchema>;
