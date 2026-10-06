import { useTranslation } from "react-i18next";
import { useDate } from "@/hooks/common/useDate";
import { toYYYYMMDD } from "@/utils/date.utils";

/** "Today", "Tomorrow", or the date formatted with `dateFormat`, in the device time zone. */
export const useDayLabel = (dateFormat = "EEEE d MMMM") => {
  const { t } = useTranslation();
  const { formatDate } = useDate();

  return (date: Date) => {
    const day = toYYYYMMDD(date);
    const now = new Date();
    const tomorrow = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1,
    );

    if (day === toYYYYMMDD(now)) return t("common.today");
    if (day === toYYYYMMDD(tomorrow)) return t("services.reservation.tomorrow");
    return formatDate(date, dateFormat);
  };
};
