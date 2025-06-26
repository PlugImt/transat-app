import type { MenuData } from "@/types/restaurant";
import i18n from "i18next";
import { apiRequest } from "./apiRequest";

const TARGET_URL = "/restaurant";

export async function getRestaurant(): Promise<MenuData | undefined> {
  // retrieve the language from the local storage
  const currentLanguage = i18n.language.toLowerCase();

  const queryParams = new URLSearchParams();
  queryParams.append("language", currentLanguage);

  return await apiRequest<MenuData>(
    `${TARGET_URL}?${queryParams.toString()}`,
    "GET",
  );
}
