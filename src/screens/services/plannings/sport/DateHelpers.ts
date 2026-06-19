import dayjs from 'dayjs';


/**
 * !!! Ce fichier n'est pas indispensable ça permet d'indexé les jours du calendrier suivant leurs noms
 * possible de le supprimer si on considère que les noms des jours sont toujours du même format et indexé depuis le backend
 * 
 * ça permet juste d'indexé les jours suivant le nom ex : "lundi, monday, lun, mon" => indexe à 0
 */

/**
 * Alias acceptés pour day_of_week, en anglais et en français,
 * pour rester tolérant selon ce que renverra l'API.
 * Index : 0 = lundi ... 6 = dimanche.
 */
const DAY_ALIASES: Record<string, number> = {
  monday: 0, mon: 0, lundi: 0, lun: 0,
  tuesday: 1, tue: 1, tues: 1, mardi: 1, mar: 1,
  wednesday: 2, wed: 2, mercredi: 2, mer: 2,
  thursday: 3, thu: 3, thur: 3, thurs: 3, jeudi: 3, jeu: 3,
  friday: 4, fri: 4, vendredi: 4, ven: 4,
  saturday: 5, sat: 5, samedi: 5, sam: 5,
  sunday: 6, sun: 6, dimanche: 6, dim: 6,
};

export function dayOfWeekToIndex(day: string): number | null {
  const key = day.trim().toLowerCase();
  return key in DAY_ALIASES ? DAY_ALIASES[key] : null;
}

/** Convertit une Date JS (0=dimanche..6=samedi) en index 0=lundi..6=dimanche */
export function jsDateToMondayIndex(date: Date): number {
  const jsDay = date.getDay();
  return jsDay === 0 ? 6 : jsDay - 1;
}


export function combineDateAndTime(date: Date, time: string): Date {
  const [h, m, s] = time.split(':').map((value) => parseInt(value, 10) || 0);
  console.log(dayjs(date).hour(h).minute(m).second(s ?? 0).millisecond(0).toDate());
  return dayjs(date).hour(h).minute(m).second(s ?? 0).millisecond(0).toDate();
}

export function formatDayLabel(date: Date): string {
  const raw = dayjs(date).format('dddd D MMMM');
  return raw.charAt(0).toUpperCase() + raw.slice(1);
}