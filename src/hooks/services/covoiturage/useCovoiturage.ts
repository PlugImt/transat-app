import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getCovoiturages,
} from "@/api";
import { QUERY_KEYS } from "@/constants";

export const useCovoiturage = () => {
  const { data, isPending, refetch, isError, error } = useQuery({
    queryKey: QUERY_KEYS.covoiturage.covoiturages,
    queryFn: () => getCovoiturages(),
  });

  return { data, isPending, refetch, isError, error };
};
