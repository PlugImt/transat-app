import type { User } from "@/types/user";

export interface EmploiDuTempsData {
  id: number;
  date: Date;
  titre: string;
  heure_debut: string;
  heure_fin: string;
  profs: string;
  salles: string;
  groupe: string;
  user_email: User["email"];
  created_at: string;
}
