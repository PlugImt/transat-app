import type { User } from "@/types/user";

export interface EmploiDuTempsData {
  courses: Course[];
  user_email: User["email"];
  created_at: string;
}

export interface Course {
  id: number;
  date: Date;
  titre: string;
  heure_debut: string;
  heure_fin: string;
  profs: string;
  salles: string;
  groupe: string;
  created_at: string;
}
