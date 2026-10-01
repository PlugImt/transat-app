import { queryOptions } from "@tanstack/react-query";
import { API_ROUTES } from "@/api/common";
import { apiRequest } from "@/api/helpers";
import { queryClient } from "@/api/query-client";
import { isSessionInvalidError, performSessionTeardown } from "@/api/session";
import { QUERY_KEYS } from "@/constants";
import type { NotLoggedIn, User } from "@/dto";
import { storage } from "@/services/storage/asyncStorage";
import { addTokenRolesToUser } from "@/utils";

export const userQueryOptions = queryOptions({
  queryKey: QUERY_KEYS.user,
  queryFn: async (): Promise<User | NotLoggedIn> => {
    const token = await storage.get<string>("token");
    if (!token) return null;

    try {
      const userData = addTokenRolesToUser(
        await apiRequest<User>(API_ROUTES.user),
        token,
      );
      await storage.set("newf", userData);
      return userData;
    } catch (error) {
      if (isSessionInvalidError(error)) {
        await performSessionTeardown(queryClient);
        return null;
      }
      // Transient failure (offline, cold start, 5xx...): keep the session on the cached user.
      const cached = await storage.get<User>("newf");
      if (cached) return addTokenRolesToUser(cached, token);
      return null;
    }
  },
  staleTime: 1000 * 60 * 5,
});
