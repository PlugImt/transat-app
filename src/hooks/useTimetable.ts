import { getTimetableToday } from "@/lib/timetable";
import { skipToken, useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/queryKeys";

export const useTimetable = (email?: string) => {
  const { data, isPending, refetch, error, isError } = useQuery({
    queryKey: QUERY_KEYS.timetable,
    queryFn: email ? () => getTimetableToday(email) : skipToken,
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
