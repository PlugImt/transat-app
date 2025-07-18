import { useQuery } from "@tanstack/react-query";
import { fetchLaundry } from "@/api";
import { QUERY_KEYS } from "@/constants";
import type { LaundryWithType } from "@/dto";

export const useLaundry = () => {
  const {
    data = [],
    isPending,
    isFetching,
    isError,
    error,
    refetch,
  } = useQuery({
    queryFn: () => fetchLaundry(),
    queryKey: QUERY_KEYS.laundry,
    initialData: [],
  });

  return {
    washingMachines: data.filter(
      (machine: LaundryWithType) => machine.type === "WASHING MACHINE",
    ),
    dryers: data.filter((machine: LaundryWithType) => machine.type === "DRYER"),
    isEmpty: data.length === 0,
    isPending,
    isFetching,
    isError,
    error,
    refetch,
  };
};
