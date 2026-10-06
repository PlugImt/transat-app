import { MotiView } from "moti";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { Button } from "@/components/common/Button";
import { Text } from "@/components/common/Text";
import { useFloatingTabBarInset } from "@/components/navigation/floatingTabBar";
import { useTheme } from "@/contexts/ThemeContext";
import { useDate } from "@/hooks/common/useDate";
import {
  useReservationFeedback,
  useReserveSlots,
} from "@/hooks/services/reservation";
import {
  type DaySlotView,
  mergeContiguousSlots,
} from "@/utils/reservation.utils";
import { ConfirmAction } from "./ConfirmAction";

export const BOOKING_BAR_HEIGHT = 76;

export type SelectedSlot = Pick<DaySlotView, "key" | "start" | "end">;

interface BookingBarProps {
  itemId: number;
  /** Selected slots, earliest first. */
  slots: SelectedSlot[];
  warningMessage?: string;
  confirmationMessage?: string;
  onClear: () => void;
  onBooked: () => void;
}

export const BookingBar = ({
  itemId,
  slots,
  warningMessage,
  confirmationMessage,
  onClear,
  onBooked,
}: BookingBarProps) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { formatDate, formatTime } = useDate();
  const tabBarInset = useFloatingTabBarInset();
  const feedback = useReservationFeedback();
  const reserveSlots = useReserveSlots();

  const ranges = mergeContiguousSlots(slots);
  const summary =
    ranges.length === 1
      ? `${formatDate(ranges[0].start, "EEE d MMM")} · ${formatTime(ranges[0].start)} – ${formatTime(ranges[0].end)}`
      : null;

  const handleConfirm = () =>
    reserveSlots.mutate(
      { itemId, starts: slots.map((slot) => slot.start) },
      {
        onSuccess: ({ total, succeeded }) => {
          if (succeeded < total) {
            feedback.failure(
              null,
              t("services.reservation.calendar.partial", {
                done: succeeded,
                total,
              }),
            );
          } else {
            feedback.success(
              confirmationMessage ?? t("services.reservation.reserveSuccess"),
            );
          }
          onBooked();
        },
        onError: (error) => {
          feedback.failure(
            error,
            t("services.reservation.errors.reserveError"),
          );
          // The slots may have been taken meanwhile; selecting again starts from fresh data.
          onBooked();
        },
      },
    );

  return (
    <MotiView
      from={{ opacity: 0, translateY: 24 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: "timing", duration: 200 }}
      className="absolute left-4 right-4 flex-row items-center gap-3 rounded-2xl border px-4"
      style={{
        bottom: tabBarInset || 12,
        height: BOOKING_BAR_HEIGHT,
        backgroundColor: theme.card,
        borderColor: theme.border,
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
        elevation: 8,
      }}
    >
      <View className="flex-1">
        <Text variant="h3" numberOfLines={1}>
          {t("services.reservation.calendar.selected", { count: slots.length })}
        </Text>
        {summary && (
          <Text variant="sm" color="muted" numberOfLines={1}>
            {summary}
          </Text>
        )}
      </View>

      <Button
        label={t("services.reservation.calendar.clear")}
        variant="ghost"
        size="sm"
        onPress={onClear}
        disabled={reserveSlots.isPending}
      />

      <ConfirmAction
        title={t("services.reservation.calendar.confirmTitle", {
          count: slots.length,
        })}
        description={t("services.reservation.reserveConfirmDesc")}
        confirmLabel={t("services.reservation.confirmReserve")}
        onConfirm={handleConfirm}
        isPending={reserveSlots.isPending}
        details={
          <View className="gap-3">
            {warningMessage && <Text>{warningMessage}</Text>}
            <View className="gap-1">
              {ranges.map((range) => (
                <Text key={range.start.toISOString()} variant="sm">
                  {`${formatDate(range.start, "EEEE d MMMM")} · ${formatTime(range.start)} – ${formatTime(range.end)}`}
                </Text>
              ))}
            </View>
          </View>
        }
      >
        <Button
          label={t("services.reservation.reserve")}
          size="sm"
          isUpdating={reserveSlots.isPending}
        />
      </ConfirmAction>
    </MotiView>
  );
};
