import { z } from "zod";
import { userSchema } from "@/dto/user";

export const associationSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  picture: z.string(),
});

export const associationDetailsSchema = z.object({
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

export const associationMembersSchema = z.object({
  members: z.array(userSchema),
  count: z.number(),
});

export type Association = z.infer<typeof associationSchema>;
export type AssociationDetails = z.infer<typeof associationDetailsSchema>;
export type AssociationMembers = z.infer<typeof associationMembersSchema>;
