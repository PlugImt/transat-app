import { z } from "zod";
import { branchSchema } from "../branch";

export const scolaritySchema = z.object({
  graduation_year: z.number().optional(),
  branch: branchSchema.optional(),
  group: z.string().optional(),
});

export type Scolarity = z.infer<typeof scolaritySchema>;
