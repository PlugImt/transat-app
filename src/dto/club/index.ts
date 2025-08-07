import { z } from "zod";
import { userSchema } from "@/dto/user";

export const clubSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  picture: z.string(),
});

export const clubDetailsSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  picture: z.string(),
  location: z.string().optional(),
  link: z.string().optional(),
  member_count: z.number(),
  member_photos: z.array(z.string()),
  responsible: userSchema.optional(),
  has_joined: z.boolean(),
});

export type Club = z.infer<typeof clubSchema>;
export type ClubDetails = z.infer<typeof clubDetailsSchema>;
