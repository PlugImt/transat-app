import { getEmploiDuTempsToday } from "@/lib/emploiDuTemps";
import { QUERY_KEYS } from "@/lib/queryKeys";
import { useQuery } from "@tanstack/react-query";

export const useEmploiDuTemps = (email: string) => {
  const { data, isPending, refetch, error, isError } = useQuery({
    queryKey: QUERY_KEYS.emploiDuTemps,
    queryFn: () => getEmploiDuTempsToday(email),
  });

  return {
    data,
    isPending,
    refetch,
    error,
    isError,
  };
};
