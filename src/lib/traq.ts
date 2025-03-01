import type { TraqArticle } from "@/types/traq";
import { t } from "i18next";

const TARGET_URL = "https://transat.destimt.fr/api/traq/";

export async function getTraq(): Promise<TraqArticle[] | undefined> {
  try {
    const response = await fetch(TARGET_URL);
    if (!response.ok) {
      throw new Error(t("common.errors.unableToFetch"));
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching the traq articles:", error);
    return;
  }
}
