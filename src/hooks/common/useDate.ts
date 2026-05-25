import { format as formatDateFns, formatDistance, isDate } from "date-fns";
import { de, enUS, es, fr, pt, zhCN } from "date-fns/locale";
import { useTranslation } from "react-i18next";

type DateFormat =
  | "weekday"
  | "time"
  | "short"
  | "long"
  | "relative"
  | "ago"
  | "dateTime";

export const useDate = () => {
  const { i18n } = useTranslation();

  const locales = {
    fr,
    en: enUS,
    es,
    de,
    pt,
    zh: zhCN,
  };

  const resolveLocale = (language: string | undefined) => {
    const key = (language || "en").split("-")[0];
    return locales[key as keyof typeof locales] ?? enUS;
  };

  const formatDate = (date: Date, format: DateFormat = "short"): string => {
    if (!isDate(date)) return String(date);

    const locale = resolveLocale(i18n.language);

    if (format === "short") return formatDateFns(date, "dd MMMM", { locale });
    if (format === "long") return formatDateFns(date, "PPPP", { locale });
    if (format === "relative") return formatRelative(date);
    if (format === "ago")
      return formatDistance(date, new Date(), { locale, addSuffix: true });
    if (format === "weekday") return formatDateFns(date, "EEEE", { locale });
    if (format === "time") return formatDateFns(date, "HH:mm", { locale });
    if (format === "dateTime") return formatDateFns(date, "Pp", { locale });

    return formatDateFns(date, format || "P", { locale });
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
