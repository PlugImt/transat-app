import {
  skipToken,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useEffect } from "react";
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

  useEffect(() => {
    if (__DEV__ && data) console.log("[Bassine] Overview fetched", data);
  }, [data]);

  useEffect(() => {
    if (__DEV__ && isError) console.error("[Bassine] Overview error", error);
  }, [isError, error]);

  return { data, isPending, refetch, error, isError };
};

export const useBassineLeaderboard = () => {
  const { data, isPending, refetch, error, isError } = useQuery({
    queryKey: QUERY_KEYS.bassine.leaderboard,
    queryFn: () => getBassineLeaderboard(),
  });

  useEffect(() => {
    if (__DEV__ && data) console.log("[Bassine] Leaderboard fetched", data);
  }, [data]);

  useEffect(() => {
    if (__DEV__ && isError) console.error("[Bassine] Leaderboard error", error);
  }, [isError, error]);

  return { data, isPending, refetch, error, isError };
};

export const useBassineHistory = () => {
  const { data, isPending, refetch, error, isError } = useQuery({
    queryKey: QUERY_KEYS.bassine.history,
    queryFn: () => getBassineHistory(),
  });

  useEffect(() => {
    if (__DEV__ && data) console.log("[Bassine] History fetched", data);
  }, [data]);

  useEffect(() => {
    if (__DEV__ && isError) console.error("[Bassine] History error", error);
  }, [isError, error]);

  return { data, isPending, refetch, error, isError };
};

export const useBassineUserHistory = (email?: string) => {
  const { data, isPending, refetch, error, isError } = useQuery({
    queryKey: [...QUERY_KEYS.bassine.userHistory, email],
    queryFn: email ? () => getBassineUserHistory(email) : skipToken,
    enabled: !!email,
  });

  useEffect(() => {
    if (__DEV__ && data)
      console.log("[Bassine] User history fetched", { email, data });
  }, [email, data]);

  useEffect(() => {
    if (__DEV__ && isError)
      console.error("[Bassine] User history error", { email, error });
  }, [email, isError, error]);

  return { data, isPending, refetch, error, isError };
};

export const useBassineIncrement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => patchBassine("up"),
    onSuccess: (res) => {
      if (__DEV__) console.log("[Bassine] Increment success", res);
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
    onSuccess: (res) => {
      if (__DEV__) console.log("[Bassine] Decrement success", res);
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
