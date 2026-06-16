import { z } from "zod";

export const covoiturageSchema = z.object({
  id: z.number(),
  name: z.string(),
  departure_time: z.string(),
  departure_place: z.string(),
  destination: z.string(),
  creator: z.object({
    email: z.string(),
    first_name: z.string(),
    last_name: z.string(),
    profile_picture: z.string().nullable().optional(),
  }),
  trip_type: z.enum(["SHOPPING", "WEEKEND","OTHER"]),
});

export type Covoiturage = z.infer<typeof covoiturageSchema>;
