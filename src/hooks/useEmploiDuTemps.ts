import { skipToken, useQuery } from "@tanstack/react-query";
import { getEmploiDuTempsToday } from "@/lib/emploiDuTemps";
import { QUERY_KEYS } from "@/lib/queryKeys";

export const useEmploiDuTemps = (email?: string) => {
  const { data, isPending, refetch, error, isError } = useQuery({
    queryKey: QUERY_KEYS.emploiDuTemps,
    queryFn: email ? () => getEmploiDuTempsToday(email) : skipToken,
    enabled: !!email,
  });

  return {
    data,
    isPending,
    refetch,
    error,
    isError,
  };
};
