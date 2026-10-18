import { useQuery } from "@tanstack/react-query";
import { fetchBusDepartures } from "@/api";
import { QUERY_KEYS } from "@/constants";

// The server caches the answer for 20 seconds.
export const useBusDepartures = () => {
  const { data, isPending, isFetching, error, isError, refetch } = useQuery({
    queryKey: QUERY_KEYS.departure,
    queryFn: fetchBusDepartures,
    staleTime: 20_000,
    refetchInterval: 30_000,
  });

  return { data, isPending, isFetching, error, isError, refetch };
};
