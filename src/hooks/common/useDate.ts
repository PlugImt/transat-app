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

  const formatDate = (date: Date, format: DateFormat = "short"): string => {
    return t(`common.dateFormats.${format}`, { date }) as string;
  };

  // Lundi
  const formatWeekday = (date: Date): string => {
    return formatDate(date, "weekday");
  };

  // 13:50
  const formatTime = (date: Date): string => {
    return formatDate(date, "time");
  };

  // 15/08/2025
  const formatShort = (date: Date): string => {
    return formatDate(date, "short");
  };

  // Lundi 15 août 2025
  const formatLong = (date: Date): string => {
    return formatDate(date, "long");
  };

  // Lundi prochain à 13:50
  const formatRelative = (date: Date): string => {
    return formatDate(date, "relative");
  };

  // Dans 6 heures
  const formatAgo = (date: Date): string => {
    return formatDate(date, "ago");
  };

  const formatDateTime = (date: Date): string => {
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
