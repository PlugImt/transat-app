import { API_ROUTES } from "@/api/common";
import { apiRequest } from "@/api/helpers";
import type { TraqArticle } from "@/dto/traq";

export const getTraq = async (): Promise<TraqArticle[]> => {
  return await apiRequest<TraqArticle[]>(API_ROUTES.traq);
};
