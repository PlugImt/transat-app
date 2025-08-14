import { z } from "zod";

export const addEventSchemaBase = z.object({
  name: z.string().min(1).min(3).max(100),
  description: z.string().optional(),
  id_club: z.number(),
  location: z.string(),
  start_date: z.string().min(1),
  end_date: z.string().optional(),
  link: z.string().optional(),
  picture: z.string().optional(),
});

export type AddEventFormData = z.infer<typeof addEventSchemaBase>;

export const createAddEventSchema = (t: (key: string) => string) =>
  addEventSchemaBase.extend({
    name: z
      .string()
      .min(1, t("services.events.add.name.required"))
      .min(3, t("services.events.add.name.min"))
      .max(100, t("services.events.add.name.max")),
    description: z
      .string()
      .max(200, t("services.events.add.description.max"))
      .optional(),
    id_club: z.number({
      required_error: t("services.events.add.organizer.required"),
    }),
    location: z
      .string()
      .min(1, t("services.events.add.location.required"))
      .min(3, t("services.events.add.location.min"))
      .max(100, t("services.events.add.location.max")),
    start_date: z.string().min(1, t("services.events.add.date.required")),
    link: z
      .string()
      .url(t("services.events.add.link.invalid"))
      .max(100, t("services.events.add.link.max"))
      .optional()
      .or(z.literal("")),
  });
