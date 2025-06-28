import type { TFunction } from "i18next";

export const getOpeningHoursData = (t: TFunction) => [
  {
    day: " ",
    lunch: t("services.restaurant.lunch"),
    dinner: t("services.restaurant.dinner"),
  },
  { day: t("common.days.monday"), lunch: "11h30-13h30", dinner: "18h30-19h45" },
  {
    day: t("common.days.tuesday"),
    lunch: "11h30-13h30",
    dinner: "18h30-19h45",
  },
  {
    day: t("common.days.wednesday"),
    lunch: "11h30-13h30",
    dinner: "18h30-19h45",
  },
  {
    day: t("common.days.thursday"),
    lunch: "11h30-13h30",
    dinner: "18h30-19h45",
  },
  {
    day: t("common.days.friday"),
    lunch: "11h30-13h30",
    dinner: t("services.restaurant.closed"),
  },
  {
    day: t("common.days.weekend"),
    lunch: t("services.restaurant.closed"),
    dinner: t("services.restaurant.closed"),
  },
];
