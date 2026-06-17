import { z } from "zod";

export const singleDepartureSchema = z.object({
    name: z.string(),
    nextDeparture: z.coerce.date(),
    nextDeparture2: z.coerce.date(),
});

export const departureDataSchema = z.array(
    singleDepartureSchema
);

export type DepartureData = z.infer<typeof departureDataSchema>;

export * from "./mocks-departure";