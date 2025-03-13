import type { MenuData } from "@/types/restaurant";
import { t } from "i18next";

const TARGET_URL = "https://transat.destimt.fr/api/restaurant";

export async function getRestaurant(): Promise<MenuData | undefined> {
  try {
    const response = await fetch(TARGET_URL);
    if (!response.ok) {
      throw new Error(t("common.errors.unableToFetch"));
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching the restaurant menu:", error);
    return;
  }
}
