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

export const getCovoiturageDetails = async (id: number) => {
  return await apiRequest<Covoiturage>(
    `${API_ROUTES.covoiturage}/${id}`,
    Method.GET,
  );
};

export const updateCovoiturage = async (id: number, data: { status: "OPEN" | "FULL" | "ARCHIVED" }) => {
  return await apiRequest<Covoiturage>(
    `${API_ROUTES.covoiturage}/${id}/status`,
    Method.PATCH, 
    data,
  );
};

export const createCovoiturage = async (data: Omit<Covoiturage, "id" | "creator" | "status">) => {
  return await apiRequest<Covoiturage>(
    `${API_ROUTES.covoiturage}`,
    Method.POST,
    data,
  );
};