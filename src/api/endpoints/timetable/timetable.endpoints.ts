import i18n from "i18next";
import { API_ROUTES } from "@/api/common";
import { Method } from "@/api/enums";
import { apiRequest } from "@/api/helpers";
import type { Timetable } from "@/dto";
import { toYYYYMMDD } from "@/utils";

export const getTimetableToday = async (email: string): Promise<Timetable> => {
  // retrieve the language from the local storage
  const currentLanguage = i18n.language.toLowerCase();
  const url = API_ROUTES.planning_today.replace(":email", email);
  const queryParams = new URLSearchParams();
  queryParams.append("language", currentLanguage);
  return await apiRequest<Timetable>(
    `${url}?${queryParams.toString()}`,
    Method.GET,
  );
};

/**
 * Fetches the timetable for a given user for the week (Monday to Sunday)
 * that contains the specified date.
 * @param email - The user's email.
 * @param forDate - A date within the desired week.
 * @returns A promise that resolves to the timetable data.
 */
export const getTimetableForWeek = async (
  email: string,
  forDate: Date,
): Promise<Timetable> => {
  const currentLanguage = i18n.language.toLowerCase();

  // Create a copy to avoid mutating the original date object
  const dateCopy = new Date(forDate);
  const dayOfWeek = dateCopy.getDay(); // Sunday - 0, Monday - 1, etc.

  // Adjust to find the Monday of the week.
  // If Sunday (0), go back 6 days. Otherwise, go back (dayOfWeek - 1) days.
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(dateCopy);
  monday.setDate(dateCopy.getDate() + diffToMonday);

  // UPDATED: Sunday is 6 days after Monday
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  const startDate = toYYYYMMDD(monday);
  const endDate = toYYYYMMDD(sunday);

  const url = API_ROUTES.planning_week.replace(":email", email);

  const queryParams = new URLSearchParams();
  queryParams.append("start", startDate);
  queryParams.append("end", endDate);
  queryParams.append("language", currentLanguage);

  return await apiRequest<Timetable>(
    `${url}?${queryParams.toString()}`,
    Method.GET,
  );
};
