import {
  skipToken,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  getBassineHistory,
  getBassineLeaderboard,
  getBassineOverview,
  getBassineUserHistory,
  patchBassine,
} from "@/api";
import { QUERY_KEYS } from "@/constants";

export const useBassineOverview = () => {
  const { data, isPending, refetch, error, isError } = useQuery({
    queryKey: QUERY_KEYS.bassine.overview,
    queryFn: () => getBassineOverview(),
  });

  return { data, isPending, refetch, error, isError };
};

export const useBassineLeaderboard = () => {
  const { data, isPending, refetch, error, isError } = useQuery({
    queryKey: QUERY_KEYS.bassine.leaderboard,
    queryFn: () => getBassineLeaderboard(),
  });

  return { data: data?.users, isPending, refetch, error, isError };
};

export const useBassineHistory = () => {
  const { data, isPending, refetch, error, isError } = useQuery({
    queryKey: QUERY_KEYS.bassine.history,
    queryFn: () => getBassineHistory(),
  });

  return { data, isPending, refetch, error, isError };
};

export const useBassineUserHistory = (email?: string) => {
  const { data, isPending, refetch, error, isError } = useQuery({
    queryKey: [...QUERY_KEYS.bassine.userHistory, email],
    queryFn: email ? () => getBassineUserHistory(email) : skipToken,
    enabled: !!email,
  });

  return { data, isPending, refetch, error, isError };
};

export const useBassineIncrement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => patchBassine("up"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.bassine.overview });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.bassine.leaderboard,
      });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.bassine.history });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.bassine.userHistory,
      });
    },
    onError: (err) => {
      if (__DEV__) console.error("[Bassine] Increment error", err);
    },
  });
};

export const useBassineDecrement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => patchBassine("down"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.bassine.overview });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.bassine.leaderboard,
      });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.bassine.history });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.bassine.userHistory,
      });
    },
    onError: (err) => {
      if (__DEV__) console.error("[Bassine] Decrement error", err);
    },
  });
};
