import i18n from "i18next";
import type { EmploiDuTempsData } from "@/types/emploiDuTemps";
import { apiRequest } from "./apiRequest";

const TARGET_URL = "/api/planning/users/:email/courses/today";

export async function getEmploiDuTempsToday(
  email: string,
): Promise<EmploiDuTempsData> {
  // retrieve the language from the local storage
  const currentLanguage = i18n.language.toLowerCase();

  TARGET_URL.replace(":email", email);

  const queryParams = new URLSearchParams();
  queryParams.append("language", currentLanguage);

  return await apiRequest<EmploiDuTempsData>(
    `${TARGET_URL}?${queryParams.toString()}`,
    "GET",
  );
}
