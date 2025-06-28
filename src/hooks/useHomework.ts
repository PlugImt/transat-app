import { skipToken, useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants";
import { getHomeworks } from "@/api";

export const useHomework = (userId?: number) => {
  const { data, isPending, refetch, error, isError } = useQuery({
    queryKey: [...QUERY_KEYS.homework, userId],
    queryFn: userId ? () => getHomeworks(userId) : skipToken,
    enabled: !!userId,
  });

  return {
    data,
    isPending,
    refetch,
    error,
    isError,
  };
};
