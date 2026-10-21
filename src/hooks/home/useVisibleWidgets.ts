import { useNow } from "@/hooks/common";
import { useEvents } from "@/hooks/services/event/useEvent";
import { useMyReservations } from "@/hooks/services/reservation";
import type { Preference } from "@/services/storage/preferences";
import { getActiveReservations } from "@/utils/reservation.utils";

/**
 * Drops widgets that are known to have nothing to show. A widget rendering null
 * would still leave a gap in the list, so they must not be listed at all.
 */
export const useVisibleWidgets = (widgets: Preference[]): Preference[] => {
  const hasReservationWidget = widgets.some(
    (widget) => widget.id === "reservation",
  );
  const now = useNow(60_000);
  const { data: reservations } = useMyReservations("current", {
    enabled: hasReservationWidget,
  });

  const hasNoReservation =
    !!reservations &&
    getActiveReservations(reservations.current, now).length === 0;

  const hasEventsWidget = widgets.some((widget) => widget.id === "events");
  const { data: events } = useEvents("upcoming", {
    enabled: hasEventsWidget,
  });
  // The API answers `null`, not `[]`, when there is no event.
  const hasNoEvents = events !== undefined && !events?.length;

  return widgets.filter(
    (widget) =>
      !(widget.id === "reservation" && hasNoReservation) &&
      !(widget.id === "events" && hasNoEvents),
  );
};
