import { API_ROUTES, apiRequest, Method } from "@/api";
import type { Club, ClubDetails, ClubMembers } from "@/dto/club";

export const getClubs = async () => {
  return await apiRequest<Club[]>(`${API_ROUTES.club}`, Method.GET);
};

export const getClubDetails = async (id: number) => {
  return await apiRequest<ClubDetails>(
    API_ROUTES.clubDetails.replace(":id", id.toString()),
    Method.GET,
  );
};

export const joinClub = async (id: number) => {
  return await apiRequest<void>(
    API_ROUTES.clubJoin.replace(":id", id.toString()),
    Method.POST,
  );
};

export const leaveClub = async (id: number) => {
  return await apiRequest<void>(
    API_ROUTES.clubLeave.replace(":id", id.toString()),
    Method.POST,
  );
};

export const getClubMembers = async (id: number) => {
  return await apiRequest<ClubMembers>(
    API_ROUTES.clubMembers.replace(":id", id.toString()),
    Method.GET,
  );
};
