import { z } from "zod";

export const menuDataSchema = z.object({
  grilladesMidi: z.array(z.string()),
  migrateurs: z.array(z.string()),
  cibo: z.array(z.string()),
  accompMidi: z.array(z.string()),
  grilladesSoir: z.array(z.string()),
  accompSoir: z.array(z.string()),
  updated_date: z.string(),
});

export type MenuData = z.infer<typeof menuDataSchema>;
