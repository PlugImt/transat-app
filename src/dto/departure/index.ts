import { z } from "zod";

export const busDepartureSchema = z.object({
  time: z.string(),
  realtime: z.boolean(),
  delaySeconds: z.number().nullish(),
});

export const busLineDeparturesSchema = z.object({
  name: z.string(),
  departures: z.array(busDepartureSchema).nullish(),
});

export const busDeparturesSchema = z.object({
  lastRefresh: z.string(),
  lastRealtime: z.string().nullish(),
  lines: z.array(busLineDeparturesSchema),
});

export type BusDeparturesData = z.infer<typeof busDeparturesSchema>;
