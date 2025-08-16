import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import {
  getClubDetails,
  getClubMembers,
  getClubs,
  joinClub,
  leaveClub,
} from "@/api";
import { QUERY_KEYS } from "@/constants";
import type { Club, ClubDetails } from "@/dto/club";

export const useClubs = () => {
  const { data, isPending, refetch, isError, error } = useQuery({
    queryKey: QUERY_KEYS.club.clubs,
    queryFn: () => getClubs(),
  });

  return { data, isPending, refetch, isError, error };
};

export const useFilteredClubs = (searchValue: string) => {
  const { data: clubs, isPending, refetch, isError, error } = useClubs();

  const filteredClubs = useMemo(() => {
    if (!clubs || !searchValue.trim()) {
      return clubs;
    }

    const searchLower = searchValue.toLowerCase().trim();

    return clubs.filter((club: Club | ClubDetails) => {
      if (club.name.toLowerCase().includes(searchLower)) {
        return true;
      }

      if (club.description.toLowerCase().includes(searchLower)) {
        return true;
      }

      if (
        "location" in club &&
        club.location &&
        club.location.toLowerCase().includes(searchLower)
      ) {
        return true;
      }

      if ("responsible" in club && club.responsible) {
        const fullName =
          `${club.responsible.first_name} ${club.responsible.last_name}`.toLowerCase();
        if (fullName.includes(searchLower)) {
          return true;
        }
      }

      return false;
    });
  }, [clubs, searchValue]);

  return {
    data: filteredClubs,
    isPending,
    refetch,
    isError,
    error,
  };
};

export const useClubDetails = (id: number) => {
  const { data, isPending, refetch, isError, error } = useQuery({
    queryKey: [...QUERY_KEYS.club.clubDetails, id],
    queryFn: () => getClubDetails(id),
  });

  return { data, isPending, refetch, isError, error };
};

export const useJoinClubMutation = (id: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [...QUERY_KEYS.club.clubJoin, id],
    mutationFn: () => joinClub(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [...QUERY_KEYS.club.clubDetails, id],
      });
    },
  });
};

export const useLeaveClubMutation = (id: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [...QUERY_KEYS.club.clubLeave, id],
    mutationFn: () => leaveClub(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [...QUERY_KEYS.club.clubDetails, id],
      });
    },
  });
};

export const useClubMembers = (id: number) => {
  const { data, isPending, refetch, isError, error } = useQuery({
    queryKey: [...QUERY_KEYS.club.clubMembers, id],
    queryFn: () => getClubMembers(id),
  });

  return { data, isPending, refetch, isError, error };
};
