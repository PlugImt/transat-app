import { getTraq } from "@/api";
import { QUERY_KEYS } from "@/constants";
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
