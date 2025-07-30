import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getClubDetails, getClubs, joinClub, leaveClub } from "@/api";
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

export const useJoinClubMutation = (id: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [...QUERY_KEYS.clubJoin, id],
    mutationFn: () => joinClub(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [...QUERY_KEYS.clubDetails, id],
      });
    },
  });
};

export const useLeaveClubMutation = (id: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [...QUERY_KEYS.clubLeave, id],
    mutationFn: () => leaveClub(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [...QUERY_KEYS.clubDetails, id],
      });
    },
  });
};
