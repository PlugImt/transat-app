import { useIsFetching, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants";

export function useHomeWidgetsFetching() {
  const queryClient = useQueryClient();
  const isMenuFetching =
    useIsFetching({ queryKey: QUERY_KEYS.restaurantMenu }) > 0;
  const isTimetableFetching =
    useIsFetching({ queryKey: QUERY_KEYS.timetable }) > 0;
  const isHomeworkFetching =
    useIsFetching({ queryKey: QUERY_KEYS.homework }) > 0;
  const isLaundrysFetching =
    useIsFetching({ queryKey: QUERY_KEYS.laundry }) > 0;
  const isWeatherFetching = useIsFetching({ queryKey: QUERY_KEYS.weather }) > 0;
  const isFetching =
    isMenuFetching ||
    isTimetableFetching ||
    isHomeworkFetching ||
    isLaundrysFetching ||
    isWeatherFetching;

  const refetch = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.restaurantMenu }),
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.homework }),
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.timetable }),
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.laundry }),
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.weather }),
    ]);
  };

  return { isFetching, refetch };
}
