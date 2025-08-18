import { useQuery } from "@tanstack/react-query";
import { getTraq } from "@/api";
import { QUERY_KEYS } from "@/constants";

export const useTraq = () => {
  const {
    data: traq,
    isPending,
    refetch,
    error,
    isError,
  } = useQuery({
    queryKey: QUERY_KEYS.traq,
    queryFn: () => getTraq(),
    initialData: [],
  });

  return {
    traq,
    isPending,
    refetch,
    error,
    isError,
  };
};
