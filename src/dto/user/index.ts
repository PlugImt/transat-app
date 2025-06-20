import { z } from "zod";

//
// — Base types
//

export const notLoggedInSchema = z.null();
export type NotLoggedIn = z.infer<typeof notLoggedInSchema>;

export const loadingSchema = z.undefined();
export type Loading = z.infer<typeof loadingSchema>;

export const userSchema = z.object({
  first_name: z.string(),
  last_name: z.string(),
  phone_number: z.string(),
  email: z.string().email(),
  graduation_year: z.number().optional(),
  profile_picture: z.string().url().optional(),
  id_newf: z.number().optional(),
  total_newf: z.number().optional(),
  password_updated_date: z.string().optional(),
  language: z.string().optional(),
  pass_id: z.number().optional(),
});

export type User = z.infer<typeof userSchema>;

export const passwordChangeSchema = z
  .object({
    email: z.string().email(),
    password: z.string(),
    new_password: z.string(),
    new_password_confirmation: z.string(),
  })
  .refine((data) => data.new_password === data.new_password_confirmation, {
    message: "Les mots de passe ne correspondent pas.",
    path: ["new_password_confirmation"],
  });

export type PasswordChange = z.infer<typeof passwordChangeSchema>;

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

export type UpdateProfilePictureResponse = z.infer<typeof updateProfilePictureResponseSchema>;