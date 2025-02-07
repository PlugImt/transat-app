import { QUERY_KEYS } from "@/lib/queryKeys";
import { fetchWashingMachines } from "@/lib/washingMachine";
import { useQuery } from "@tanstack/react-query";

export function useWashingMachines() {
  const { data, isPending, isFetching, isError, error, refetch } = useQuery({
    queryFn: () => fetchWashingMachines(),
    queryKey: QUERY_KEYS.washingMachines,
  });

  return {
    data: data,
    isPending,
    isFetching,
    isError,
    error,
    refetch,
  };
}
