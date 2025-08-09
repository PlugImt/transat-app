import { API_ROUTES, apiRequest, Method } from "@/api";
import type { Club, GetReservation } from "@/dto";

export const getReservationRoot = async () => {
  return await apiRequest<GetReservation[]>(
    `${API_ROUTES.reservation}`,
    Method.GET,
  );
};

export const getReservationCategories = async (id: number) => {
  return await apiRequest<GetReservation[]>(
    API_ROUTES.reservationCategory.replace(":id", id.toString()),
    Method.GET,
  );
};

export const getReservationClub = async (id: number) => {
  return await apiRequest<Club>(
    API_ROUTES.reservationClub.replace(":id", id.toString()),
    Method.GET,
  );
};

export const getReservationItem = async (id: number, date: string) => {
  return await apiRequest<GetReservation>(
    API_ROUTES.reservationItem.replace(":id", id.toString()) +
      `${date ? `date=${date}` : ""}`,
    Method.GET,
  );
};

export const updateReservation = async (id: number, startTime: string) => {
  if (startTime) {
    return await apiRequest(
      API_ROUTES.reservationItem.replace(":id", id.toString()),
      Method.PATCH,
      { start_date: startTime },
    );
  }

  return await apiRequest(
    API_ROUTES.reservationItem.replace(":id", id.toString()),
    Method.PATCH,
    { end_date: new Date().toISOString().slice(0, 19).replace("T", " ") },
  );
};
