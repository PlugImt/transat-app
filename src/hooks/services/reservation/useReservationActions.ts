import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  cancelSlot,
  reserveSlot,
  returnItem,
  takeItem,
} from "@/api/endpoints/reservation/reservation.endpoint";
import { QUERY_KEYS } from "@/constants";

const useReservationMutation = <TVariables, TResult>(
  mutationFn: (variables: TVariables) => Promise<TResult>,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    // Also on failure: a conflict means the screen shows stale availability.
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.reservation.all }),
  });
};

export type ReserveSlotsResult = { total: number; succeeded: number };

/** Slots are booked one by one by the API; fails only when none could be booked. */
export const useReserveSlots = () =>
  useReservationMutation(
    async ({
      itemId,
      starts,
    }: {
      itemId: number;
      starts: Date[];
    }): Promise<ReserveSlotsResult> => {
      const results = await Promise.allSettled(
        starts.map((start) => reserveSlot(itemId, start)),
      );
      const succeeded = results.filter((r) => r.status === "fulfilled").length;

      if (succeeded === 0) {
        const failure = results.find((r) => r.status === "rejected");
        throw failure?.status === "rejected" ? failure.reason : new Error();
      }

      return { total: starts.length, succeeded };
    },
  );

export const useCancelSlot = () =>
  useReservationMutation(({ itemId, start }: { itemId: number; start: Date }) =>
    cancelSlot(itemId, start),
  );

export const useTakeItem = () =>
  useReservationMutation((itemId: number) => takeItem(itemId));

export const useReturnItem = () =>
  useReservationMutation((itemId: number) => returnItem(itemId));
