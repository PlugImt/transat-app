import { getTimetableToday, getTimetableForWeek } from "@/lib/timetable";
import { skipToken, useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/queryKeys";

// Existing hook for the 'today' endpoint
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

// Helper to get a stable identifier for a week (e.g., Monday's date as 'YYYY-MM-DD')
// This ensures the query key is consistent for any day within the same week.
const getWeekId = (d: Date): string => {
  const date = new Date(d); // Create a copy
  const day = date.getDay(); // 0=Sun, 1=Mon, ...
  const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  const monday = new Date(date.setDate(diff));

  // Format to YYYY-MM-DD to use as a stable cache key
  return monday.toISOString().slice(0, 10);
}

/**
 * A React Query hook to fetch timetable data for the week containing the given date.
 * It automatically re-fetches when the date changes to a new week.
 * @param email - The user's email.
 * @param date - The date for which to fetch the timetable week.
 */
export const useTimetableForWeek = (email?: string, date?: Date) => {
  const weekId = date ? getWeekId(date) : undefined;

  const { data, isPending, refetch, error, isError } = useQuery({
    // The query key includes the weekId. React Query will cache data for each unique week
    // and trigger a fetch only when the weekId changes.
    queryKey: [QUERY_KEYS.timetable, email, weekId],

    // Use the new getTimetableForWeek function for the API call
    queryFn: (email && date) ? () => getTimetableForWeek(email, date) : skipToken,

    // The query is enabled only when all required parameters are available
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