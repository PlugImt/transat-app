import { useQuery } from "@tanstack/react-query";
import { getClubDetails, getClubs } from "@/api";
import { QUERY_KEYS } from "@/constants";

export const useClubs = () => {
  const { data, isPending, refetch, isError, error } = useQuery({
    queryKey: QUERY_KEYS.clubs,
    queryFn: () => getClubs(),
  });

  return { data, isPending, refetch, isError, error };
};

export const useClubDetails = (id: number) => {
  const { data, isPending, refetch, isError, error } = useQuery({
    queryKey: [...QUERY_KEYS.clubDetails, id],
    queryFn: () => getClubDetails(id),
  });

  return { data, isPending, refetch, isError, error };
};
