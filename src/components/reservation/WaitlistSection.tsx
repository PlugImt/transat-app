import { Bell } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { Button } from "@/components/common/Button";
import Card from "@/components/common/Card";
import { Text } from "@/components/common/Text";
import { useTheme } from "@/contexts/ThemeContext";
import type { WaitlistEntry } from "@/dto/reservation";
import { useDate } from "@/hooks/common/useDate";
import {
  useDeclineWaitlist,
  useLeaveWaitlist,
  useMyWaitlist,
  useReservationFeedback,
  useReserveFromWaitlist,
} from "@/hooks/services/reservation";
import { waitlistEntryKey } from "@/utils/reservation.utils";
import { parseApiDate } from "@/utils/reservation-time";

const HOUR_MS = 60 * 60 * 1000;

const WaitlistRow = ({ entry }: { entry: WaitlistEntry }) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { formatDate, formatTime } = useDate();
  const feedback = useReservationFeedback();
  const reserve = useReserveFromWaitlist();
  const decline = useDeclineWaitlist();
  const leave = useLeaveWaitlist();

  const start = entry.start_date ? parseApiDate(entry.start_date) : undefined;
  const target = { itemId: entry.item_id, start };
  const isBusy = reserve.isPending || decline.isPending || leave.isPending;

  const when = start
    ? `${formatDate(start, "d MMM")} ${formatTime(start)} – ${formatTime(new Date(start.getTime() + HOUR_MS))}`
    : t("services.reservation.waitlist.waitingForReturn");

  const handleReserve = () =>
    reserve.mutate(target, {
      onSuccess: () =>
        feedback.success(t("services.reservation.reserveSuccess")),
      onError: (error) =>
        feedback.waitlistFailure(
          error,
          t("services.reservation.errors.reserveError"),
        ),
    });

  const handleDecline = () =>
    decline.mutate(target, {
      onSuccess: () =>
        feedback.success(t("services.reservation.waitlist.declined")),
      onError: (error) =>
        feedback.waitlistFailure(
          error,
          t("services.reservation.waitlist.errors.leaveError"),
        ),
    });

  const handleLeave = () =>
    leave.mutate(target, {
      onSuccess: () =>
        feedback.success(t("services.reservation.waitlist.left")),
      onError: (error) =>
        feedback.waitlistFailure(
          error,
          t("services.reservation.waitlist.errors.leaveError"),
        ),
    });

  return (
    <Card
      className="gap-3"
      accessibilityLabel={`${entry.item_name}, ${when}`}
      active={entry.notified}
    >
      <View className="gap-1">
        <Text variant="h3" numberOfLines={1}>
          {entry.item_name}
        </Text>
        <Text variant="sm" color="muted" numberOfLines={1}>
          {when}
        </Text>
        <View className="flex-row items-center gap-2">
          <View
            className="h-2 w-2 rounded-full"
            style={{
              backgroundColor: entry.notified ? theme.success : theme.warning,
            }}
          />
          <Text variant="sm" color="muted" className="flex-1">
            {entry.notified
              ? t("services.reservation.waitlist.availableNow")
              : t("services.reservation.waitlist.queued", {
                  position: entry.position,
                })}
          </Text>
        </View>
      </View>

      {entry.notified ? (
        <View className="flex-row gap-2">
          <Button
            className="flex-1"
            size="sm"
            label={t("services.reservation.reserve")}
            isUpdating={reserve.isPending}
            disabled={isBusy}
            onPress={handleReserve}
          />
          <Button
            className="flex-1"
            size="sm"
            variant="secondary"
            label={t("common.cancel")}
            isUpdating={decline.isPending}
            disabled={isBusy}
            onPress={handleDecline}
          />
        </View>
      ) : (
        <Button
          size="sm"
          variant="ghost"
          label={t("services.reservation.waitlist.leave")}
          isUpdating={leave.isPending}
          disabled={isBusy}
          onPress={handleLeave}
        />
      )}
    </Card>
  );
};

/** The alerts the user asked for; one that was released shows the "Réserver" and "Annuler" actions. */
export const WaitlistSection = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { data } = useMyWaitlist();

  if (!data || data.length === 0) return null;

  const entries = [...data].sort(
    (a, b) => Number(b.notified) - Number(a.notified),
  );

  return (
    <View className="gap-2">
      <View className="flex-row items-center gap-2 ml-1">
        <Bell size={16} color={theme.muted} />
        <Text variant="lg">
          {t("services.reservation.waitlist.sectionTitle")}
        </Text>
      </View>
      {entries.map((entry) => (
        <WaitlistRow key={waitlistEntryKey(entry)} entry={entry} />
      ))}
    </View>
  );
};
