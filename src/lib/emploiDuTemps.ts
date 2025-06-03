import type { EmploiDuTempsData } from "@/types/emploiDuTemps";
import i18n from "i18next";
import { apiRequest } from "./apiRequest";

const TARGET_URL = "/api/emploiDuTemps";

export async function getEmploiDuTemps(): Promise<
  EmploiDuTempsData | undefined
> {
  // retrieve the language from the local storage
  const currentLanguage = i18n.language.toLowerCase();

  const queryParams = new URLSearchParams();
  queryParams.append("language", currentLanguage);

  return await apiRequest<EmploiDuTempsData>(
    `${TARGET_URL}?${queryParams.toString()}`,
    "GET",
  );
}
