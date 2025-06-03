import { getEmploiDuTemps } from "@/lib/emploiDuTemps";
import { QUERY_KEYS } from "@/lib/queryKeys";
import { useQuery } from "@tanstack/react-query";

export const useEmploiDuTemps = () => {
  const { data, isPending, refetch, error, isError } = useQuery({
    queryKey: QUERY_KEYS.emploiDuTemps,
    queryFn: () => getEmploiDuTemps(),
  });

  return {
    data,
    isPending,
    refetch,
    error,
    isError,
  };
};
