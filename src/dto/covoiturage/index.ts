import { z } from "zod";

export const covoiturageSchema = z.object({
  id: z.number(),
  name: z.string(),
  time: z.string(),
  departure: z.string(),
  destination: z.string(),
  creator: z.string(),
  trip_type: z.enum(["SHOPPING", "WEEK-END"]),
});

export type Covoiturage = z.infer<typeof covoiturageSchema>;
