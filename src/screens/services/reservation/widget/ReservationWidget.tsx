import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "expo-router/react-navigation";
import { CalendarClock, Package } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import Card from "@/components/common/Card";
import CardGroup from "@/components/common/CardGroup";
import { Text } from "@/components/common/Text";
import { WidgetBoundary } from "@/components/query";
import { TextSkeleton } from "@/components/Skeleton";
import { useTheme } from "@/contexts/ThemeContext";
import type { MyReservation } from "@/dto/reservation";
import { useNow } from "@/hooks/common";
import { useDate } from "@/hooks/common/useDate";
import { useDayLabel, useMyReservations } from "@/hooks/services/reservation";
import type { AppNavigation } from "@/types";
import {
  getActiveReservations,
  pickWidgetReservations,
  reservationKey,
} from "@/utils/reservation.utils";
import { parseApiDate } from "@/utils/reservation-time";

/** Rows shown in full; any row beyond is clipped and faded out. */
const FULL_ROWS = 3;

const WidgetRow = ({ reservation }: { reservation: MyReservation }) => {
  const { theme } = useTheme();
  const { formatTime, formatAgo } = useDate();
  const dayLabel = useDayLabel("EEE d MMM");

  const start = parseApiDate(reservation.start_date);
  const end = reservation.end_date ? parseApiDate(reservation.end_date) : null;
  const Icon = reservation.slot ? CalendarClock : Package;

  return (
    <View className="flex-row items-center gap-3">
      <Icon size={18} color={theme.text} />
      <Text numberOfLines={1} className="flex-1 font-semibold">
        {reservation.name}
      </Text>
      <Text variant="sm" color="muted" numberOfLines={1}>
        {reservation.slot
          ? `${dayLabel(start)} ${formatTime(start)}${end ? ` – ${formatTime(end)}` : ""}`
          : formatAgo(start)}
      </Text>
    </View>
  );
};

export const ReservationWidget = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const navigation = useNavigation<AppNavigation>();
  const now = useNow(60_000);
  const { data, isPending, isFetching, isError, error, refetch } =
    useMyReservations("current");

  const rows = pickWidgetReservations(
    getActiveReservations(data?.current ?? [], now),
  );
  const isClipped = rows.length > FULL_ROWS;
  const openReservations = () => navigation.navigate("MyReservations");

  return (
    <WidgetBoundary
      title={t("services.reservation.personal.title")}
      query={{ isPending, isFetching, isError, error, refetch }}
      loading={<ReservationWidgetSkeleton />}
      isEmpty={rows.length === 0}
    >
      <CardGroup
        title={t("services.reservation.personal.title")}
        onPress={openReservations}
      >
        <Card
          className={`relative overflow-hidden gap-3 px-4 py-3 ${isClipped ? "max-h-[132px]" : ""}`}
          onPress={openReservations}
        >
          {rows.map((reservation) => (
            <WidgetRow
              key={reservationKey(reservation)}
              reservation={reservation}
            />
          ))}
          {isClipped && (
            <LinearGradient
              pointerEvents="none"
              colors={[`${theme.card}00`, theme.card]}
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: 0,
                height: 56,
              }}
            />
          )}
        </Card>
      </CardGroup>
    </WidgetBoundary>
  );
};

export const ReservationWidgetSkeleton = () => {
  const { t } = useTranslation();

  return (
    <CardGroup title={t("services.reservation.personal.title")}>
      <Card className="gap-1 px-4 py-3">
        <TextSkeleton lastLineWidth="60%" />
        <TextSkeleton lastLineWidth="45%" />
      </Card>
    </CardGroup>
  );
};
