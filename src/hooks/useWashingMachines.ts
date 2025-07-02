import { useQuery } from "@tanstack/react-query";
import { fetchWashingMachines } from "@/api";
import { QUERY_KEYS } from "@/constants";
import type { MachineWithType } from "@/dto";

export const useWashingMachines = () => {
  const {
    data = [],
    isPending,
    isFetching,
    isError,
    error,
    refetch,
  } = useQuery({
    queryFn: () => fetchWashingMachines(),
    queryKey: QUERY_KEYS.washingMachines,
    initialData: [],
  });

  return {
    washingMachines: data.filter(
      (machine: MachineWithType) => machine.type === "WASHING MACHINE",
    ),
    dryers: data.filter((machine: MachineWithType) => machine.type === "DRYER"),
    isEmpty: data.length === 0,
    isPending,
    isFetching,
    isError,
    error,
    refetch,
  };
};
