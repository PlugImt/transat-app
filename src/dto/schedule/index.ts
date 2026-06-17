import { z } from "zod";

export const calendarEventSchema = z.object({
  id: z.string(),
  name: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  location: z.string(),
});

export const calendarDataSchema = z.record(
  z.string(),
  z.array(calendarEventSchema),
);

export const userScheduleSchema = z.object({
  user_id: z.number(),
  ics_url: z.string().optional(),
  last_sync_at: z.string().optional(),
  calendar_data: calendarDataSchema.optional(),
});

export type CalendarEvent = z.infer<typeof calendarEventSchema>;
export type CalendarData = z.infer<typeof calendarDataSchema>;
export type UserSchedule = z.infer<typeof userScheduleSchema>;

export const updateUserScheduleSchema = z.object({
  ics_url: z.string().url(),
});

export type UpdateUserSchedule = z.infer<typeof updateUserScheduleSchema>;
