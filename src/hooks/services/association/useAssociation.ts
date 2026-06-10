import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import {
  getAssociationDetails,
  getAssociationMembers,
  getAssociations,
  joinAssociation,
  leaveAssociation,
} from "@/api";
import { QUERY_KEYS } from "@/constants";
import type { Association, AssociationDetails } from "@/dto/association";

export const useAssociations = () => {
  const { data, isPending, refetch, isError, error } = useQuery({
    queryKey: QUERY_KEYS.association.associations,
    queryFn: () => getAssociations(),
  });

  return { data, isPending, refetch, isError, error };
};

export const useFilteredAssociations = (searchValue: string) => {
  const { data: associations, isPending, refetch, isError, error } = useAssociations();

  const filteredAssociations = useMemo(() => {
    if (!associations || !searchValue.trim()) {
      return associations;
    }

    const searchLower = searchValue.toLowerCase().trim();

    return associations.filter((association: Association | AssociationDetails) => {
      if (association.name.toLowerCase().includes(searchLower)) {
        return true;
      }

      if (association.description.toLowerCase().includes(searchLower)) {
        return true;
      }

      if (
        "location" in association &&
        association.location &&
        association.location.toLowerCase().includes(searchLower)
      ) {
        return true;
      }

      if ("responsible" in association && association.responsible) {
        const fullName =
          `${association.responsible.first_name} ${association.responsible.last_name}`.toLowerCase();
        if (fullName.includes(searchLower)) {
          return true;
        }
      }

      return false;
    });
  }, [associations, searchValue]);

  return {
    data: filteredAssociations,
    isPending,
    refetch,
    isError,
    error,
  };
};

export const useAssociationDetails = (id: number) => {
  const { data, isPending, refetch, isError, error } = useQuery({
    queryKey: [...QUERY_KEYS.association.associationDetails, id],
    queryFn: () => getAssociationDetails(id),
  });

  return { data, isPending, refetch, isError, error };
};

export const useJoinAssociationMutation = (id: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [...QUERY_KEYS.association.associationJoin, id],
    mutationFn: () => joinAssociation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [...QUERY_KEYS.association.associationDetails, id],
      });
    },
  });
};

export const useLeaveAssociationMutation = (id: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [...QUERY_KEYS.association.associationLeave, id],
    mutationFn: () => leaveAssociation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [...QUERY_KEYS.association.associationDetails, id],
      });
    },
  });
};

export const useAssociationMembers = (id: number) => {
  const { data, isPending, refetch, isError, error } = useQuery({
    queryKey: [...QUERY_KEYS.association.associationMembers, id],
    queryFn: () => getAssociationMembers(id),
  });

  return { data, isPending, refetch, isError, error };
};
