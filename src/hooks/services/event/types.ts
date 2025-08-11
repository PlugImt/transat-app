import { z } from "zod";

export const addEventSchemaBase = z.object({
  name: z.string().min(1).min(3).max(100),
  description: z.string().min(1).min(10).max(500),
  id_club: z.number(),
  location: z.string().min(1).min(3).max(100),
  start_date: z.string(),
  end_date: z.string(),
  link: z.string().url().optional().or(z.literal("")),
  picture: z.string().optional(),
});

export type AddEventFormData = z.infer<typeof addEventSchemaBase>;

export const createAddEventSchema = (t: (key: string) => string) =>
  z.object({
    name: z
      .string()
      .min(1, t("services.events.add.name.required"))
      .min(3, t("services.events.add.name.min"))
      .max(100, t("services.events.add.name.max")),
    description: z
      .string()
      .min(1, t("services.events.add.description.required"))
      .min(10, t("services.events.add.description.min"))
      .max(500, t("services.events.add.description.max")),
    id_club: z.number(),
    location: z
      .string()
      .min(1, t("services.events.add.location.required"))
      .min(3, t("services.events.add.location.min"))
      .max(100, t("services.events.add.location.max")),
    start_date: z.string(),
    end_date: z.string(),
    link: z
      .string()
      .url(t("services.events.add.link.invalid"))
      .optional()
      .or(z.literal("")),
    picture: z.string().optional(),
  });
