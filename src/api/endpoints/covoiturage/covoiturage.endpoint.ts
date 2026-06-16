import { API_ROUTES } from "@/api/common";
import { Method } from "@/api/enums";
import { apiRequest } from "@/api/helpers";
import { Covoiturage } from "@/dto";

export const getCovoiturages = async () => {
  return await apiRequest<Covoiturage[]>(
    `${API_ROUTES.covoiturage}`,
    Method.GET,
  );
};