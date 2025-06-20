import { z } from "zod";
import { userSchema } from "@/dto";

export const courseSchema = z.object({
  id: z.number(),
  date: z.instanceof(Date),
  titre: z.string(),
  heure_debut: z.string(),
  heure_fin: z.string(),
  profs: z.string(),
  salles: z.string(),
  groupe: z.string(),
  created_at: z.string(),
});

export type Course = z.infer<typeof courseSchema>;

export const emploiDuTempsDataSchema = z.object({
  courses: z.array(courseSchema),
  user_email: userSchema.shape.email,
  created_at: z.string(),
});

export type EmploiDuTempsData = z.infer<typeof emploiDuTempsDataSchema>;