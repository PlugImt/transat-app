import { useQuery } from "@tanstack/react-query";
import { fetchDeparture } from "@/api";
import { QUERY_KEYS } from "@/constants";

export const useSchedule = () => {
  const { data, isPending, error, isError } = useQuery({
    queryKey: QUERY_KEYS.departure,
    queryFn: fetchDeparture,
  });

  return { departure: data ?? [], isPending, error, isError };
};