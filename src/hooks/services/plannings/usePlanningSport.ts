import { useQuery } from "@tanstack/react-query";

import { QUERY_KEYS } from "@/constants";
import { getPlanningSport } from "@/api/endpoints/plannings";

export const usePlanningSport = () => {
  const { data, isPending, refetch, isError, error } = useQuery({
    queryKey: QUERY_KEYS.plannings.planningSport,
    queryFn: () => getPlanningSport(),
  });

  return { data, isPending, refetch, isError, error };
};
