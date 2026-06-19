import { dayOfWeekToIndex, jsDateToMondayIndex } from './DateHelpers';
import type { PlanningSport } from '@/dto/plannings_sport';

/**
 * Filtre les séances correspondant au jour de semaine de `date`,
 * puis les trie par heure de début croissante.
 *
 * start_time et end_time sont déjà des `Date` (via le schema Zod),
 * donc on compare directement leurs timestamps.
 */
export function getEventsForDate(
  plannings: PlanningSport[],
  date: Date,
): PlanningSport[] {
  const targetIndex = jsDateToMondayIndex(date);

  return plannings
    .filter((p) => dayOfWeekToIndex(p.day_of_week) === targetIndex)
}