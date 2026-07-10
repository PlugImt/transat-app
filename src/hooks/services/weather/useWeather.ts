import { useQuery } from "@tanstack/react-query";
import { fetchWeather } from "@/api";
import { QUERY_KEYS } from "@/constants";

export const useWeather = () => {
  const { data, isPending, isFetching, error, isError, refetch } = useQuery({
    queryKey: QUERY_KEYS.weather,
    queryFn: () => fetchWeather(),
  });

  return { data, isPending, isFetching, error, isError, refetch };
};
