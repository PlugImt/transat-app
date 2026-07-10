import { queryOptions } from "@tanstack/react-query";
import { API_ROUTES } from "@/api/common";
import { apiRequest } from "@/api/helpers";
import { queryClient } from "@/api/query-client";
import { performSessionTeardown } from "@/api/session";
import { QUERY_KEYS } from "@/constants";
import type { NotLoggedIn, User } from "@/dto";
import { storage } from "@/services/storage/asyncStorage";

export const userQueryOptions = queryOptions({
  queryKey: QUERY_KEYS.user,
  queryFn: async (): Promise<User | NotLoggedIn> => {
    const token = await storage.get("token");
    if (!token) return null;

    try {
      const userData = await apiRequest<User>(API_ROUTES.user);
      await storage.set("newf", userData);
      return userData;
    } catch (_error) {
      await performSessionTeardown(queryClient);
      return null;
    }
  },
  staleTime: 1000 * 60 * 5,
});
