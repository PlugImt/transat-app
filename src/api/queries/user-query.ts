import { queryOptions } from "@tanstack/react-query";
import { API_ROUTES } from "@/api/common";
import { ApiError } from "@/api/errors";
import { apiRequest } from "@/api/helpers";
import { queryClient } from "@/api/query-client";
import { performSessionTeardown } from "@/api/session";
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
      // Only log out on 401 Unauthorized; network/other errors keep the session
      // so the app can work offline and retry once connectivity is restored.
      if (ApiError.isApiError(error) && error.status !== 401) {
        return null;
      }
      await performSessionTeardown(queryClient);
      return null;
    }
  },
  staleTime: 1000 * 60 * 5,
  retry: (failureCount, error) => {
    if (ApiError.isApiError(error) && error.status === 401) {
      return false;
    }
    return failureCount < 3;
  },
});
