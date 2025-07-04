import { z } from "zod";
import { passwordChangeSchema } from ".";

//
// — Update payloads
//

export const updateUserPayloadSchema = z.object({
  first_name: z.string(),
  last_name: z.string(),
  phone_number: z.string(),
  graduation_year: z.number(),
  language: z.string(),
});

export type UpdateUserPayload = z.infer<typeof updateUserPayloadSchema>;

export const updateLanguagePayloadSchema = z.object({
  language: z.string(),
});

export type UpdateLanguagePayload = z.infer<typeof updateLanguagePayloadSchema>;

export const updatePasswordPayloadSchema = passwordChangeSchema;

export type UpdatePasswordPayload = z.infer<typeof updatePasswordPayloadSchema>;

export const updateProfilePictureResponseSchema = z.object({
  profile_picture: z.string().url(),
});

export type UpdateProfilePictureResponse = z.infer<
  typeof updateProfilePictureResponseSchema
>;
