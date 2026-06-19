import { useQuery } from "@tanstack/react-query";

import { getInteSchedule } from "@/api/endpoints/schedule";
import { QUERY_KEYS } from "@/constants";

export const usePlanningInte = () => {
  const { data, isPending, refetch, isError, error } = useQuery({
    queryKey: QUERY_KEYS.plannings.planningInte,
    queryFn: () => getInteSchedule(),
  });

  return { data, isPending, refetch, isError, error };
};
