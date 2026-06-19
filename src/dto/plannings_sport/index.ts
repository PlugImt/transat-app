import { z } from "zod";

export const planningSportSchema = z.object({
  id: z.number(),
  day_of_week: z.string(),
  activity: z.string(),
  place: z.string(),
  start_time: z.date(),
  end_time: z.date(),
});
export type PlanningSport = z.infer<typeof planningSportSchema>;
