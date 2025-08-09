import { useQuery } from "@tanstack/react-query";
import { fetchWeather } from "@/api";
import { QUERY_KEYS } from "@/constants";

export const useWeather = () => {
  const { data, isPending, error, isError } = useQuery({
    queryKey: QUERY_KEYS.weather,
    queryFn: () => fetchWeather(),
  });

  return { data, isPending, error, isError };
};
