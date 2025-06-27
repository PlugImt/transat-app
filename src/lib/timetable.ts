import type { Timetable } from '@/types/timetable';
import i18n from 'i18next';
import { apiRequest } from './apiRequest';

const TARGET_URL_TODAY = "/planning/users/:email/courses/today";
const TARGET_URL_WEEK = "/planning/users/:email/courses";

export async function getTimetableToday(
  email: string,
): Promise<Timetable> {
  // retrieve the language from the local storage
  const currentLanguage = i18n.language.toLowerCase();
  const url = TARGET_URL_TODAY.replace(":email", email);
  const queryParams = new URLSearchParams();
  queryParams.append("language", currentLanguage);
  return await apiRequest<Timetable>(`${url}?${queryParams.toString()}`, "GET");
}

// Helper to format a Date object to 'YYYY-MM-DD' string
function toYYYYMMDD(date: Date): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Fetches the timetable for a given user for the week (Monday to Sunday)
 * that contains the specified date.
 * @param email - The user's email.
 * @param forDate - A date within the desired week.
 * @returns A promise that resolves to the timetable data.
 */
export async function getTimetableForWeek(
    email: string,
    forDate: Date,
): Promise<Timetable> {
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

  const url = TARGET_URL_WEEK.replace(":email", email);

  const queryParams = new URLSearchParams();
  queryParams.append("start", startDate);
  queryParams.append("end", endDate);
  queryParams.append("language", currentLanguage);

  return await apiRequest<Timetable>(
      `${url}?${queryParams.toString()}`,
      "GET",
  );
}