import { z } from "zod";
import type { TFunction } from "i18next";

export const covoiturageSchema = z.object({
  id: z.number(),
  description: z.string(),
  departure_time: z.string(),
  departure_place: z.string(),
  destination: z.string(),
  creator: z.object({
    email: z.string(),
    first_name: z.string(),
    last_name: z.string(),
    profile_picture: z.string().nullable().optional(),
  }),
  trip_type: z.enum(["SHOPPING", "LONG_TRIP","OTHER"]),
});

export const createAddCovoiturageSchema = (t: TFunction) =>
  z.object({
    departure_place: z.string().min(1, t("services.covoit.errors.departure_required", "Le départ est requis")),
    destination: z.string().min(1, t("services.covoit.errors.destination_required", "L'arrivée est requise")),
    departure_time: z.string().min(1, t("services.covoit.errors.date_required", "La date et l'heure sont requises")),
    contact_details: z.string().min(1, t("services.covoit.errors.contact_required", "Le contact est requis")),
    trip_type: z.enum(["SHOPPING", "LONG_TRIP", "OTHER"]),
    description: z.string().min(1, t("services.covoit.errors.description_required", "La description est requise")),
  });

export type Covoiturage = z.infer<typeof covoiturageSchema>;
export type AddCovoiturageFormData = z.infer<ReturnType<typeof createAddCovoiturageSchema>>;
