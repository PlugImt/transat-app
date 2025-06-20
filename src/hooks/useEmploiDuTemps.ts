import { getEmploiDuTempsToday } from "@/api";
import { QUERY_KEYS } from "@/constants";
import { skipToken, useQuery } from "@tanstack/react-query";

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