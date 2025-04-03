import type { TraqArticle } from "@/types/traq";
import { t } from "i18next";
import { apiRequest } from "./apiRequest";

const TARGET_URL = "/api/traq/";

export async function getTraq(): Promise<TraqArticle[] | undefined> {
  return await apiRequest<TraqArticle[]>(TARGET_URL);
}
