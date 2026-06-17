import { API_ROUTES } from "@/api/common";
import { Method } from "@/api/enums";
import { apiRequest } from "@/api/helpers";
import type { DepartureData } from "@/dto";

export type SingleDeparture = DepartureData[number];

export const fetchDeparture = async (): Promise<DepartureData> => {
  const data = await apiRequest<DepartureData>(API_ROUTES.departure, Method.GET);
  return data;
};

