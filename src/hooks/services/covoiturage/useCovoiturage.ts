import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCovoiturages,
  getCovoiturageDetails,
  updateCovoiturage,
  createCovoiturage,
} from "@/api";
import { QUERY_KEYS } from "@/constants";
import { Covoiturage } from "@/dto";

export const useCovoiturage = () => {
  const { data, isPending, refetch, isError, error } = useQuery({
    queryKey: QUERY_KEYS.covoiturage.covoiturages,
    queryFn: () => getCovoiturages(),
  });

  return { data, isPending, refetch, isError, error };
};

export const useCovoiturageDetails = (id: number) => {
  const { data, isPending, isError, error, refetch } = useQuery({
    queryKey: [...QUERY_KEYS.covoiturage.covoiturages, id], 
    queryFn: () => getCovoiturageDetails(id),
    enabled: !!id,
  });

  return { data, isPending, isError, error, refetch };
};

export const useUpdateCovoiturage = () => {
  const queryClient = useQueryClient();

  const { mutate, mutateAsync, isPending, isError, error } = useMutation({
    mutationFn: ({ id, status }: { id: number; status: "OPEN" | "FULL" | "ARCHIVED" }) =>
      updateCovoiturage(id, { status }),
    
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.covoiturage.covoiturages,
      });
    },
  });

  return { mutate, mutateAsync, isPending, isError, error };
};

export const useAddCovoiturage = () => {
  const queryClient = useQueryClient();

  const { mutate, mutateAsync, isPending, isError, error } = useMutation({
    mutationFn: (newCovoit: Omit<Covoiturage, "id" | "creator" | "status">) =>
      createCovoiturage(newCovoit),
    
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.covoiturage.covoiturages,
      });
    },
  });

  return { mutate, mutateAsync, isPending, isError, error };
};