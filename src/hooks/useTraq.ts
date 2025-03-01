import { QUERY_KEYS } from "@/lib/queryKeys";
import { getTraq } from "@/lib/traq";
import { useQuery } from "@tanstack/react-query";

export const useTraq = () => {
  const { data, isPending, refetch, error, isError } = useQuery({
    queryKey: QUERY_KEYS.traq,
    queryFn: () => getTraq(),
  });

  return {
    data,
    isPending,
    refetch,
    error,
    isError,
  };
};
