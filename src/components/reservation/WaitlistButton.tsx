import { Bell, BellOff } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/common/Button";
import {
  useJoinWaitlist,
  useLeaveWaitlist,
  useMyWaitlist,
  useReservationFeedback,
} from "@/hooks/services/reservation";
import { findWaitlistEntry } from "@/utils/reservation.utils";

interface WaitlistButtonProps {
  itemId: number;
  /** The slot to be alerted about; omit for an item without slot. */
  start?: Date;
}

/** Asks to be alerted when something reserved by someone else is released, or takes that request back. */
export const WaitlistButton = ({ itemId, start }: WaitlistButtonProps) => {
  const { t } = useTranslation();
  const feedback = useReservationFeedback();
  const { data: entries, isPending: isLoading } = useMyWaitlist();
  const join = useJoinWaitlist();
  const leave = useLeaveWaitlist();

  const entry = findWaitlistEntry(entries, itemId, start);
  const isUpdating = join.isPending || leave.isPending;

  const handlePress = () => {
    if (entry) {
      leave.mutate(
        { itemId, start },
        {
          onSuccess: () =>
            feedback.success(t("services.reservation.waitlist.left")),
          onError: (error) =>
            feedback.waitlistFailure(
              error,
              t("services.reservation.waitlist.errors.leaveError"),
            ),
        },
      );
      return;
    }

    join.mutate(
      { itemId, start },
      {
        onSuccess: ({ position }) =>
          feedback.success(
            t("services.reservation.waitlist.joined", { position }),
          ),
        onError: (error) =>
          feedback.waitlistFailure(
            error,
            t("services.reservation.waitlist.errors.joinError"),
          ),
      },
    );
  };

  return (
    <Button
      size="sm"
      variant={entry ? "ghost" : "secondary"}
      label={
        entry
          ? t("services.reservation.waitlist.leave")
          : t("services.reservation.waitlist.join")
      }
      icon={entry ? <BellOff size={14} /> : <Bell size={14} />}
      isUpdating={isUpdating}
      disabled={isLoading}
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityState={{ selected: !!entry, busy: isUpdating }}
    />
  );
};
