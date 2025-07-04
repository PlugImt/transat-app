import { z } from "zod";

export const courseSchema = z.object({
  id: z.number(),
  created_at: z.string(),
  date: z.coerce.date(),
  end_time: z.string(),
  group: z.string(),
  room: z.string(),
  start_time: z.string(),
  teacher: z.string(),
  title: z.string(),
  user_email: z.string().email(),
});

export type Course = z.infer<typeof courseSchema>;
