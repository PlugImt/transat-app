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

export const useLaundryStats = () => {
  const { washingMachines, dryers, isPending, isError, error } = useLaundry();

  const availableWashers = washingMachines.filter(
    (machine: LaundryWithType) => machine.available,
  ).length;
  const totalWashers = washingMachines.length;

  const availableDryers = dryers.filter(
    (machine: LaundryWithType) => machine.available,
  ).length;
  const totalDryers = dryers.length;

  return {
    availableWashers,
    totalWashers,
    availableDryers,
    totalDryers,
    isPending,
    isError,
    error,
  };
};
