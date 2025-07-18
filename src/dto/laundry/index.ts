import { z } from "zod";

export const laundrySchema = z.object({
  number: z.number(),
  available: z.boolean(),
  time_left: z.number(),
});

export const laundryTypeSchema = z.enum(["WASHING MACHINE", "DRYER"]);

export const laundryWithTypeSchema = laundrySchema.extend({
  type: laundryTypeSchema,
});

export const LaundryApiResponse = z.object({
  success: z.boolean(),
  data: z.object({
    washing_machine: z.array(laundrySchema).optional(),
    dryer: z.array(laundrySchema).optional(),
  }),
});

export type LaundryData = z.infer<typeof laundrySchema>;
export type LaundryType = z.infer<typeof laundryTypeSchema>;
export type LaundryWithType = z.infer<typeof laundryWithTypeSchema>;
export type LaundryApiResponseSchema = z.infer<typeof LaundryApiResponse>;
