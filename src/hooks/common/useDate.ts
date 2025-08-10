import { useTranslation } from "react-i18next";

type DateFormat =
  | "weekday"
  | "time"
  | "short"
  | "long"
  | "relative"
  | "ago"
  | "dateTime"
  | string;

export const useDate = () => {
  const { t } = useTranslation();

  const formatDate = (date: Date, format: DateFormat = "short") => {
    return t("common.dateFormats." + format, { date });
  };

  const formatWeekday = (date: Date) => {
    return formatDate(date, "weekday");
  };

  const formatTime = (date: Date) => {
    return formatDate(date, "time");
  };

  const formatShort = (date: Date) => {
    return formatDate(date, "short");
  };

  const formatLong = (date: Date) => {
    return formatDate(date, "long");
  };

  const formatRelative = (date: Date) => {
    return formatDate(date, "relative");
  };

  const formatAgo = (date: Date) => {
    return formatDate(date, "ago");
  };

  const formatDateTime = (date: Date) => {
    return formatDate(date, "dateTime");
  };

  return {
    formatDate,
    formatWeekday,
    formatTime,
    formatShort,
    formatLong,
    formatRelative,
    formatAgo,
    formatDateTime,
  };
};
