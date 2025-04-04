import type { MenuData } from "@/types/restaurant";
import { apiRequest } from "./apiRequest";

const TARGET_URL = "/api/restaurant";

export async function getRestaurant(): Promise<MenuData | undefined> {
  return await apiRequest<MenuData>(TARGET_URL);
}
