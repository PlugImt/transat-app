import { API_ROUTES } from "@/api/common";
import { Method } from "@/api/enums";
import { apiRequest } from "@/api/helpers";
import { PlanningSport } from "@/dto/plannings_sport";

export const getPlanningSport = async () => {
  return await apiRequest<PlanningSport[]>(
    API_ROUTES.planning_sport,
    Method.GET,
  );
};