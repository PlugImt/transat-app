import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/queryKeys";
import { fetchWashingMachines } from "@/lib/washingMachine";
import type { MachineData } from "@/types/washingMachine";

export function useWashingMachines() {
  const { data, isPending, isFetching, isError, error, refetch } = useQuery({
    queryFn: () => fetchWashingMachines(),
    queryKey: QUERY_KEYS.washingMachines,
  });

  return {
    data: data as
      | (MachineData & { type: "WASHING MACHINE" | "DRYER" })[]
      | undefined,
    isPending,
    isFetching,
    isError,
    error,
    refetch,
  };
}
