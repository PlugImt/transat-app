import type { Timetable } from '@/types/Timetable';
import i18n from 'i18next';
import { apiRequest } from './apiRequest';

const TARGET_URL = "/api/planning/users/:email/courses/today";

export async function getTimetableToday(
  email: string,
): Promise<Timetable> {
  // retrieve the language from the local storage
  const currentLanguage = i18n.language.toLowerCase();

  TARGET_URL.replace(":email", email);

  const queryParams = new URLSearchParams();
  queryParams.append("language", currentLanguage);

  return await apiRequest<Timetable>(
    `${TARGET_URL}?${queryParams.toString()}`,
    "GET",
  );
}
