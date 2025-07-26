import { API_ROUTES, apiRequest, Method } from "@/api";
import type { Club, ClubDetails } from "@/dto/club";

export const getClubs = async () => {
  return await apiRequest<Club[]>(`${API_ROUTES.club}`, Method.GET);
};

export const getClubDetails = async (id: number) => {
  return await apiRequest<ClubDetails>(
    API_ROUTES.club.replace(":id", id.toString()),
    Method.GET,
  );
};
