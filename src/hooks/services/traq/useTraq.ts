import { useQuery } from "@tanstack/react-query";
import { getTraq } from "@/api";
import { QUERY_KEYS } from "@/constants";

export const useTraq = () => {
  const {
    data: traq,
    isPending,
    isFetching,
    refetch,
    error,
    isError,
  } = useQuery({
    queryKey: QUERY_KEYS.traq,
    queryFn: () => getTraq(),
  });

  return {
    traq,
    isPending,
    isFetching,
    refetch,
    error,
    isError,
  };
};
