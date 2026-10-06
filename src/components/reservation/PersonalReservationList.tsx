import { CalendarX2 } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { Text } from "@/components/common/Text";
import { Empty } from "@/components/page/Empty";
import { WidgetErrorCard } from "@/components/query";
import { useDate } from "@/hooks/common/useDate";
import { useDayLabel, useMyReservations } from "@/hooks/services/reservation";
import {
  groupByLocalDay,
  reservationKey,
  sortByStart,
} from "@/utils/reservation.utils";
import { parseApiDate } from "@/utils/reservation-time";
import { RowSkeleton } from "./CatalogCards";
import { MyReservationRow } from "./MyReservationRow";

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <View className="gap-2">
    <Text variant="lg" className="ml-1 capitalize">
      {title}
    </Text>
    {children}
  </View>
);

export const PersonalReservationList = ({
  filter,
}: {
  filter: "current" | "past";
}) => {
  const { t } = useTranslation();
  const { formatAgo } = useDate();
  const dayLabel = useDayLabel();
  const { data, isPending, isError, error, refetch } =
    useMyReservations(filter);
  const isPast = filter === "past";

  if (isPending) {
    return (
      <View className="gap-2">
        <RowSkeleton />
        <RowSkeleton />
        <RowSkeleton />
      </View>
    );
  }

  if (isError) {
    return <WidgetErrorCard error={error} onRetry={refetch} />;
  }

  const reservations = data[filter];

  if (reservations.length === 0) {
    return (
      <Empty
        icon={<CalendarX2 />}
        title={t(
          isPast
            ? "services.reservation.personal.emptyPast"
            : "services.reservation.personal.emptyUpcoming",
        )}
        description={t(
          isPast
            ? "services.reservation.personal.emptyPastDescription"
            : "services.reservation.personal.emptyUpcomingDescription",
        )}
      />
    );
  }

  const held = isPast
    ? []
    : sortByStart(
        reservations.filter((reservation) => !reservation.slot),
        "asc",
      );
  const dated = sortByStart(
    isPast
      ? reservations
      : reservations.filter((reservation) => reservation.slot),
    isPast ? "desc" : "asc",
  );
  const nextKey = isPast ? undefined : reservationKey(dated[0] ?? held[0]);

  return (
    <View className="gap-6">
      {held.length > 0 && (
        <Section title={t("services.reservation.current")}>
          {held.map((reservation) => (
            <MyReservationRow
              key={reservationKey(reservation)}
              reservation={reservation}
            />
          ))}
        </Section>
      )}

      {groupByLocalDay(dated).map((group) => (
        <Section key={group.day} title={dayLabel(group.date)}>
          {group.items.map((reservation) => {
            const key = reservationKey(reservation);
            const start = parseApiDate(reservation.start_date);
            return (
              <MyReservationRow
                key={key}
                reservation={reservation}
                past={isPast}
                caption={
                  key === nextKey && reservation.slot && start > new Date()
                    ? formatAgo(start)
                    : undefined
                }
              />
            );
          })}
        </Section>
      ))}
    </View>
  );
};
