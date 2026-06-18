import { z } from "zod";

const phoneRegex = /^\+[1-9]\d{6,14}$/;

export const addCovoiturageSchemaBase = z.object({
  departure_place: z.string().min(1).min(3).max(100),
  destination: z.string().min(1).min(3).max(100),
  departure_time: z.string().min(1),
  contact_details: z.string().regex(phoneRegex),
  trip_type: z.enum(["SHOPPING", "LONG_TRIP", "OTHER"]),
  description: z.string().min(1).max(500),
});

export type AddCovoiturageFormData = z.infer<typeof addCovoiturageSchemaBase>;

export const createAddCovoiturageSchema = (t: (key: string) => string) =>
  addCovoiturageSchemaBase.extend({
    departure_place: z
      .string()
      .min(1, t("services.covoit.add.departure.required"))
      .min(3, t("services.covoit.add.departure.min"))
      .max(100, t("services.covoit.add.departure.max")),
    
    destination: z
      .string()
      .min(1, t("services.covoit.add.destination.required"))
      .min(3, t("services.covoit.add.destination.min"))
      .max(100, t("services.covoit.add.destination.max")),
    
    departure_time: z
      .string()
      .min(1, t("services.covoit.add.date.required")),
    
    contact_details: z
      .string()
      .min(1, t("services.covoit.add.contact.required"))
      .regex(phoneRegex, t("services.covoit.add.contact.invalid_phone")),
    
    trip_type: z.enum(["SHOPPING", "LONG_TRIP", "OTHER"], {
      required_error: t("services.covoit.add.type.required"),
    }),
    
    description: z
      .string()
      .min(1, t("services.covoit.add.description.required"))
      .max(500, t("services.covoit.add.description.max")),
  });