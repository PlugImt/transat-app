import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteOrderMutation,
  getItemsFromEventId,
  getTypesFromEventId,
  getUpcomingEventsWithPhoneOrder,
  postOrderMutation,
  updateOrderMutation,
} from "@/api/endpoints/fourchettas";
import type { FourchettasEvent, FourchettasItem, FourchettasType } from "@/dto";

export const useEventsUpcomingPhone = (phone: string) => {
  return useQuery<FourchettasEvent[], Error>({
    queryKey: ["events", "upcoming", phone],
    queryFn: () => getUpcomingEventsWithPhoneOrder(phone),
  });
};

export const useItemsFromEventId = (event_id: number) => {
  return useQuery<FourchettasItem[], Error>({
    queryKey: ["events", event_id, "items"],
    queryFn: () => getItemsFromEventId(event_id),
  });
};

export const useTypesFromEventId = (event_id: number) => {
  return useQuery<FourchettasType[], Error>({
    queryKey: ["events", event_id, "types"],
    queryFn: () => getTypesFromEventId(event_id),
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

export const useDeleteOrder = (phone: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ event_id }: { event_id: number }) =>
      deleteOrderMutation(event_id, phone),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["events", "upcoming", phone],
      });
    },
  });
};
