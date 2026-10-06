import { useTranslation } from "react-i18next";
import { ApiError } from "@/api/errors";
import { useToast } from "@/components/common/Toast";
import { hapticFeedback } from "@/utils/haptics.utils";

export const useReservationFeedback = () => {
  const { t } = useTranslation();
  const { toast } = useToast();

  const success = (message: string) => {
    toast(message, "success");
    hapticFeedback.success();
  };

  const failure = (error: unknown, fallbackMessage: string) => {
    const isConflict = ApiError.isApiError(error) && error.status === 409;
    toast(
      isConflict ? t("services.reservation.errors.conflict") : fallbackMessage,
      "destructive",
    );
    hapticFeedback.error();
  };

  return { success, failure };
};
