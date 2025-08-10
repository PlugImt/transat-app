import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  type EventTimeFilter,
  getEventDetails,
  getEventMembers,
  getEvents,
  joinEvent,
  leaveEvent,
} from "@/api/endpoints/event/event.endpoint";
import { QUERY_KEYS } from "@/constants";

export const useEvents = (time: EventTimeFilter = "upcoming") => {
  const { data, isPending, refetch, isError, error } = useQuery({
    queryKey: [...QUERY_KEYS.event.events, time],
    queryFn: () => getEvents(time),
  });

  return { data, isPending, refetch, isError, error };
};

export const useEventDetails = (id: number) => {
  const { data, isPending, refetch, isError, error } = useQuery({
    queryKey: [...QUERY_KEYS.event.eventDetails, id],
    queryFn: () => getEventDetails(id),
  });

  return { data, isPending, refetch, isError, error };
};

export const useJoinEventMutation = (id: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [...QUERY_KEYS.event.eventJoin, id],
    mutationFn: () => joinEvent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [...QUERY_KEYS.event.eventDetails, id],
      });
    },
  });
};

export const useLeaveClubMutation = (id: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [...QUERY_KEYS.event.eventLeave, id],
    mutationFn: () => leaveEvent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [...QUERY_KEYS.event.eventDetails, id],
      });
    },
  });
};

export const useEventMembers = (id: number) => {
  const { data, isPending, refetch, isError, error } = useQuery({
    queryKey: [...QUERY_KEYS.event.eventMembers, id],
    queryFn: () => getEventMembers(id),
  });

  return { data, isPending, refetch, isError, error };
};
