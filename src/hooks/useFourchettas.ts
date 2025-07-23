import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getUpcomingEventsWithPhoneOrder,
  getItemsFromEventId,
  postOrderMutation,
  updateOrderMutation,
} from "@/api/endpoints/fourchettas";
import type { Event, Item } from "@/dto";

export const useEventsUpcomingPhone = (phone: string) => {
  return useQuery<Event[], Error>({
    queryKey: ["events", "upcoming", phone],
    queryFn: () => getUpcomingEventsWithPhoneOrder(phone),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useItemsFromEventId = (event_id: number) => {
  return useQuery<Item[], Error>({
    queryKey: ["events", event_id, "items"],
    queryFn: () => getItemsFromEventId(event_id),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const usePostOrder = (phone: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postOrderMutation,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["events", "upcoming", phone],
      });
    },
  });
};

export const useUpdateOrder = (phone: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateOrderMutation,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["events", "upcoming", phone],
      });
    },
  });
};
