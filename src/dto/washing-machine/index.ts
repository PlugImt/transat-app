import { z } from "zod";

export const machineDataSchema = z.object({
  number: z.number(),
  available: z.boolean(),
  time_left: z.number(),
});

export const machineTypeSchema = z.enum(["WASHING MACHINE", "DRYER"]);

export const machineWithTypeSchema = machineDataSchema.extend({
  type: machineTypeSchema,
});

export const machinesApiResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    washing_machine: z.array(machineDataSchema).optional(),
    dryer: z.array(machineDataSchema).optional(),
  }),
});

export type MachineData = z.infer<typeof machineDataSchema>;
export type MachineType = z.infer<typeof machineTypeSchema>;
export type MachineWithType = z.infer<typeof machineWithTypeSchema>;
export type MachinesApiResponse = z.infer<typeof machinesApiResponseSchema>;
