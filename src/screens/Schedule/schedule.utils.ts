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
