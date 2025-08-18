import { API_ROUTES, apiRequest, Method } from "@/api";
import type {
  BassineHistoryItem,
  BassineLeaderboardEntry,
  BassineOverview,
} from "@/dto";

export const getBassineOverview = async () => {
  return await apiRequest<BassineOverview>(`${API_ROUTES.bassine}`, Method.GET);
};

export const patchBassine = async (type: "up" | "down") => {
  return await apiRequest<BassineOverview>(
    `${API_ROUTES.bassine}`,
    Method.PATCH,
    undefined,
    {
      params: { type },
    },
  );
};

export const getBassineLeaderboard = async () => {
  return await apiRequest<{ users: BassineLeaderboardEntry[] }>(
    `${API_ROUTES.bassineLeaderboard}`,
    Method.GET,
  );
};

export const getBassineHistory = async () => {
  return await apiRequest<BassineHistoryItem[]>(
    `${API_ROUTES.bassineHistory}`,
    Method.GET,
  );
};

export const getBassineUserHistory = async (email: string) => {
  return await apiRequest<BassineHistoryItem[]>(
    API_ROUTES.bassineUserHistory.replace(":email", email),
    Method.GET,
  );
};
