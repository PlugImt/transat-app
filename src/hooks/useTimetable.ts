import { skipToken, useQuery } from "@tanstack/react-query";
import { getTimetableForWeek, getTimetableToday } from "@/api";
import { QUERY_KEYS } from "@/constants";
import { getWeekId } from "@/utils";

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

export const useTimetableForWeek = (email?: string, date?: Date) => {
  const weekId = date ? getWeekId(date) : undefined;

  const { data, isPending, refetch, error, isError } = useQuery({
    queryKey: [QUERY_KEYS.timetable, email, weekId],
    queryFn: email && date ? () => getTimetableForWeek(email, date) : skipToken,
    enabled: !!email && !!date && !!weekId,
  });

  return {
    data,
    isPending,
    refetch,
    error,
    isError,
  };
};
