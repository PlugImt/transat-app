import type { CalendarEvent } from "@/dto";
import { toYYYYMMDD } from "@/utils";

export const HOUR_HEIGHT = 60;
export const START_HOUR = 8;
export const END_HOUR = 18;
export const TOTAL_HOURS = END_HOUR - START_HOUR;

export const formatScheduleTime = (time: string): string => {
  const [hours, minutes] = time.split(":");
  return `${hours}h${minutes}`;
};

export const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

export const isEventOver = (endTime: string, selectedDate: Date): boolean => {
  const now = new Date();

  if (now.toDateString() === selectedDate.toDateString()) {
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    return currentMinutes > timeToMinutes(endTime);
  }

  return now > selectedDate;
};

export const getNowTimelineOffset = (): number => {
  const now = new Date();
  const minutesSinceStart = (now.getHours() - START_HOUR) * 60 + now.getMinutes();
  return (minutesSinceStart / 60) * HOUR_HEIGHT + 10;
};

export const getNextTwoEvents = (
    calendarData: Record<string, CalendarEvent[]> | undefined
): CalendarEvent[] => {
  if (!calendarData) return [];

  const now = new Date();
  const todayStr = toYYYYMMDD(now);
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const todayEvents = calendarData[todayStr] ?? [];
  const upcomingToday = todayEvents
      .filter((event) => {
        const [endHours, endMinutes] = event.endTime.split(":").map(Number);
        const eventEndMinutes = endHours * 60 + endMinutes;
        return eventEndMinutes > currentMinutes;
      })
      .sort((a, b) => a.startTime.localeCompare(b.startTime));

  if (upcomingToday.length > 0) {
    return upcomingToday.slice(0, 2);
  }

  const sortedDates = Object.keys(calendarData)
      .filter((dateKey) => dateKey > todayStr)
      .sort();

  for (const nextDateKey of sortedDates) {
    const nextDayEvents = calendarData[nextDateKey] ?? [];

    if (nextDayEvents.length > 0) {
      return [...nextDayEvents]
          .sort((a, b) => a.startTime.localeCompare(b.startTime))
          .slice(0, 2);
    }
  }

  return [];
};