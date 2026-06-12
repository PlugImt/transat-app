import { z } from "zod";

export const associationUserSchema = z.object({
  email: z.string().email(),
  first_name: z.string(),
  last_name: z.string(),
  profile_picture: z.string().catch(""),
  graduation_year: z.number().nullable().optional(),
  is_respo: z.boolean().optional(),
});

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
  location: z.string().catch(""),
  link: z.string().catch(""),
  member_count: z.number(),
  member_photos: z.array(z.string()),
  responsibles: z.array(associationUserSchema).catch([]),
  has_joined: z.boolean(),
});

export const associationMembersSchema = z.object({
  members: z.array(associationUserSchema),
  count: z.number(),
});

export type Association = z.infer<typeof associationSchema>;
export type AssociationDetails = z.infer<typeof associationDetailsSchema>;
export type AssociationMembers = z.infer<typeof associationMembersSchema>;