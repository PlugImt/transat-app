import { t } from "i18next";
import { z } from "zod";
import { formationName } from "@/enums";
import { passwordChangeSchema } from ".";

export const updateUserPayloadSchema = z.object({
  first_name: z.string().nonempty(t("auth.errors.firstName")),
  last_name: z.string().nonempty(t("auth.errors.lastName")),
  phone_number: z
    .string()
    .refine((val) => !val || /^\+?\d{8,15}$/.test(val), {
      message: t("auth.errors.phone"),
    })
    .optional(),
  email: z.string().refine(
    (val) => {
      if (!val) return true;
      return (
        z.string().email().safeParse(val).success &&
        val.endsWith("@imt-atlantique.net")
      );
    },
    {
      message: t("auth.errors.email"),
    },
  ),
  graduation_year: z.number().optional(),
  formation_name: z.nativeEnum(formationName).optional(),
});

export type UpdateUserPayload = z.infer<typeof updateUserPayloadSchema>;

export const updatePasswordPayloadSchema = passwordChangeSchema;

export type UpdatePasswordPayload = z.infer<typeof updatePasswordPayloadSchema>;

export const updateProfilePictureResponseSchema = z.object({
  profile_picture: z.string().url(),
});

export type UpdateProfilePictureResponse = z.infer<
  typeof updateProfilePictureResponseSchema
>;
