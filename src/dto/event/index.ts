import { z } from "zod";
import { userSchema } from "@/dto/user";
import { clubSchema } from "../club";

export const eventSchema = z.object({
  id: z.number(),
  name: z.string(),
  start_date: z.string(),
  end_date: z.string(),
  location: z.string(),
  picture: z.string(),
  attendee_count: z.number(),
  member_photos: z.array(z.string()),
});

export const eventDetailsSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  link: z.string().optional(),
  start_date: z.string(),
  end_date: z.string(),
  location: z.string(),
  picture: z.string(),
  attendee_count: z.number(),
  attendees: z.array(userSchema),
  creator: userSchema,
  club: clubSchema,
});

export const eventMembersSchema = z.object({
  members: z.array(userSchema),
  count: z.number(),
});

export type Event = z.infer<typeof eventSchema>;
export type EventDetails = z.infer<typeof eventDetailsSchema>;
export type EventMembers = z.infer<typeof eventMembersSchema>;
