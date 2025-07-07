import { z } from "zod";

export const menuItemSchema = z.object({
  name: z.string(),
  id: z.number(),
  average_rating: z.number().nullable(),
});

export const menuDataSchema = z.object({
  grilladesMidi: z.array(menuItemSchema),
  migrateurs: z.array(menuItemSchema),
  cibo: z.array(menuItemSchema),
  accompMidi: z.array(menuItemSchema),
  grilladesSoir: z.array(menuItemSchema),
  accompSoir: z.array(menuItemSchema),
  updated_date: z.date(),
});

export type MenuData = z.infer<typeof menuDataSchema>;
