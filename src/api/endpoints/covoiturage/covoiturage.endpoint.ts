import { API_ROUTES } from "@/api/common";
import { Method } from "@/api/enums";
import { apiRequest } from "@/api/helpers";

export const getCovoiturages = async () => {
  return await apiRequest<Event[]>(
    `${API_ROUTES.covoiturage}`,
    Method.GET,
  );
};