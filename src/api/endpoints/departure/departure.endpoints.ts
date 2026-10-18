import { API_ROUTES } from "@/api/common";
import { Method } from "@/api/enums";
import { apiRequest } from "@/api/helpers";
import type { BusDeparturesData } from "@/dto";

export const fetchBusDepartures = () =>
  apiRequest<BusDeparturesData>(API_ROUTES.departure, Method.GET);
