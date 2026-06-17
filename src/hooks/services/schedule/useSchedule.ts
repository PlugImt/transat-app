import { useQuery } from "@tanstack/react-query";
import { getMySchedule } from "@/api";
import { QUERY_KEYS } from "@/constants";

export const useSchedule = () => {
  const { data, isPending, isFetching, isError, error, refetch } = useQuery({
    queryKey: QUERY_KEYS.schedule,
    queryFn: getMySchedule,
  });

  return {
    data,
    isPending,
    isFetching,
    isError,
    error,
    refetch,
    isNotConfigured: !isPending && data === null,
  };
};
