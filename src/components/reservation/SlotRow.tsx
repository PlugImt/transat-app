import { Circle, CircleCheck, Lock } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { TouchableOpacity, View } from "react-native";
import { Text } from "@/components/common/Text";
import { useTheme } from "@/contexts/ThemeContext";
import { useDate } from "@/hooks/common/useDate";
import {
  useCancelSlot,
  useReservationFeedback,
} from "@/hooks/services/reservation";
import { hapticFeedback } from "@/utils/haptics.utils";
import { type DaySlotView, formatUserName } from "@/utils/reservation.utils";
import { differsFromParis, formatParisTime } from "@/utils/reservation-time";
import { ActionPill } from "./ActionPill";
import { ConfirmAction } from "./ConfirmAction";

interface SlotRowProps {
  itemId: number;
  slot: DaySlotView;
  selected: boolean;
  onToggle: (slot: DaySlotView) => void;
}

export const SlotRow = ({ itemId, slot, selected, onToggle }: SlotRowProps) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { formatTime } = useDate();
  const feedback = useReservationFeedback();
  const cancelSlot = useCancelSlot();

  const range = `${formatTime(slot.start)} – ${formatTime(slot.end)}`;
  const parisHint = differsFromParis(slot.start)
    ? t("services.reservation.calendar.parisTime", {
        time: formatParisTime(slot.start),
      })
    : null;

  const canSelect = slot.status === "free" && !slot.isPast;
  const canCancel = slot.status === "mine" && !slot.isPast;

  const statusLabel =
    slot.status === "free"
      ? t("services.reservation.calendar.free")
      : slot.status === "mine"
        ? t("services.reservation.calendar.mine")
        : t("services.reservation.status.takenBy", {
            name: slot.user ? formatUserName(slot.user) : "",
          });

  const handleCancel = () =>
    cancelSlot.mutate(
      { itemId, start: slot.start },
      {
        onSuccess: () =>
          feedback.success(t("services.reservation.cancelSuccess")),
        onError: (error) =>
          feedback.failure(error, t("services.reservation.errors.cancelError")),
      },
    );

  const row = (
    <TouchableOpacity
      activeOpacity={0.7}
      disabled={!canSelect && !canCancel}
      onPress={
        canSelect
          ? () => {
              hapticFeedback.light();
              onToggle(slot);
            }
          : undefined
      }
      accessibilityRole={canSelect ? "checkbox" : "button"}
      accessibilityLabel={`${range}, ${statusLabel}`}
      accessibilityState={{
        checked: canSelect ? selected : undefined,
        disabled: !canSelect && !canCancel,
      }}
      className="flex-row items-center justify-between gap-3 rounded-xl border-[1.5px] px-4 py-3"
      style={{
        backgroundColor: selected ? `${theme.primary}15` : theme.card,
        borderColor: selected ? theme.primary : theme.border,
        opacity: slot.isPast ? 0.45 : slot.status === "taken" ? 0.7 : 1,
      }}
    >
      <View>
        <Text variant="h3">{range}</Text>
        {parisHint && (
          <Text variant="sm" color="muted">
            {parisHint}
          </Text>
        )}
      </View>

      <View className="flex-row items-center gap-2 flex-shrink">
        {slot.status === "taken" && (
          <>
            <Lock size={14} color={theme.muted} />
            <Text
              variant="sm"
              color="muted"
              numberOfLines={1}
              className="flex-shrink"
            >
              {statusLabel}
            </Text>
          </>
        )}
        {slot.status === "mine" && (
          <ActionPill label={statusLabel} tone="primary" />
        )}
        {canSelect &&
          (selected ? (
            <CircleCheck size={24} color={theme.primary} />
          ) : (
            <Circle size={24} color={theme.muted} />
          ))}
      </View>
    </TouchableOpacity>
  );

  return (
    <ConfirmAction
      disabled={!canCancel}
      title={t("services.reservation.cancelReservation")}
      description={t("services.reservation.cancelConfirmDesc")}
      confirmLabel={t("services.reservation.confirmCancel")}
      onConfirm={handleCancel}
      isPending={cancelSlot.isPending}
    >
      {row}
    </ConfirmAction>
  );
};
