import { QUERY_KEYS } from "@/constants";
import { useQuery } from "@tanstack/react-query";
import { MachineData } from "@/dto";
import { fetchWashingMachines } from "@/api";

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
