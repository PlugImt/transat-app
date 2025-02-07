import { QUERY_KEYS } from "@/lib/queryKeys";
import { fetchWeather } from "@/lib/weather";
import { useQuery } from "@tanstack/react-query";

export const useWeather = () => {
  const { data, isPending, error, isError } = useQuery({
    queryKey: QUERY_KEYS.weather,
    queryFn: () => fetchWeather(),
  });

  return { data, isPending, error, isError };
};
