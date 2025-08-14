import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import {
  addEvent,
  deleteEvent,
  type EventTimeFilter,
  getEventDetails,
  getEventMembers,
  getEvents,
  joinEvent,
  leaveEvent,
  updateEvent,
} from "@/api/endpoints/event/event.endpoint";
import { useToast } from "@/components/common/Toast";
import { QUERY_KEYS } from "@/constants";
import { hapticFeedback } from "@/utils/haptics.utils";
import type { AddEventFormData } from "./types";

export const useEvents = (time: EventTimeFilter = "upcoming") => {
  const { data, isPending, refetch, isError, error } = useQuery({
    queryKey: [...QUERY_KEYS.event.events, time],
    queryFn: () => getEvents(time),
    staleTime: 1000 * 60 * 5,
  });

  return { data, isPending, refetch, isError, error };
};

export const useEventsByTab = (tabValue: "upcoming" | "past") => {
  const {
    data: events,
    isPending,
    isError,
    error,
    refetch,
  } = useEvents(tabValue);

  return {
    events,
    isPending,
    isError,
    error,
    refetch,
  };
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

export const useAddEvent = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { t } = useTranslation();

  const { mutate, isPending } = useMutation({
    mutationKey: [...QUERY_KEYS.event.events],
    mutationFn: (data: AddEventFormData) => addEvent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [...QUERY_KEYS.event.events],
      });

      toast(t("services.events.add.success"), "success");
      hapticFeedback.success();
    },
    onError: () => {
      hapticFeedback.error();
      toast(t("services.events.add.error"), "destructive");
    },
  });

  return { mutate, isPending };
};

export const useDeleteEvent = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { t } = useTranslation();

  const { mutate, isPending } = useMutation({
    mutationKey: [...QUERY_KEYS.event.events],
    mutationFn: (id: number) => deleteEvent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [...QUERY_KEYS.event.events],
      });

      toast(t("services.events.delete.success"), "success");
      hapticFeedback.success();
    },
    onError: () => {
      toast(t("services.events.delete.error"), "destructive");
      hapticFeedback.error();
    },
  });

  return { mutate, isPending };
};

export const useUpdateEvent = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { t } = useTranslation();

  const { mutate, isPending } = useMutation({
    mutationKey: [...QUERY_KEYS.event.events],
    mutationFn: ({ id, data }: { id: number; data: AddEventFormData }) =>
      updateEvent(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: [...QUERY_KEYS.event.events],
      });
      queryClient.invalidateQueries({
        queryKey: [...QUERY_KEYS.event.eventDetails, id],
      });

      toast(t("services.events.edit.success"), "success");
      hapticFeedback.success();
    },
    onError: () => {
      toast(t("services.events.edit.error"), "destructive");
      hapticFeedback.error();
    },
  });

  return { mutate, isPending };
};
