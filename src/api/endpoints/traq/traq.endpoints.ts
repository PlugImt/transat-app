import { API_ROUTES, apiRequest } from "@/api";
import type { TraqArticle } from "@/dto/traq";

export const getTraq = async (): Promise<TraqArticle[]> => {
  return await apiRequest<TraqArticle[]>(API_ROUTES.traq);
};
