/**
 * Checks if the current time is before 2 PM
 */
export const isLunch = () => {
  const hour = new Date().getHours();
  return hour < 14;
};

/**
 * Checks if the current time is between 2 PM and 8 PM
 */
export const isDinner = () => {
  const hour = new Date().getHours();
  return hour >= 14 && hour < 20;
};

/**
 * Checks if the current day is a weekend (Saturday or Sunday)
 */
export const isWeekend = () => {
  const now = new Date();
  const day = now.getDay();
  return day === 0 || day === 6 || (day === 5 && now.getHours() > 14);
};

/**
 * Checks if the last update date is before today
 */
export const outOfService = (lastUpdate: string) => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const updateDate = new Date(lastUpdate);
  const updateDay = new Date(
    updateDate.getFullYear(),
    updateDate.getMonth(),
    updateDate.getDate(),
  );
  return updateDay < today;
};

export const toYYYYMMDD = (date: Date): string => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

export const isoToHourString = (isoString: string): string => {
  const date = new Date(isoString);
  const hours = date.getUTCHours().toString().padStart(2, "0");
  const minutes = date.getUTCMinutes().toString().padStart(2, "0");
  return `${hours}h${minutes}`;
};

export const getWeekId = (d: Date): string => {
  const date = new Date(d);
  const day = date.getDay(); // 0=Sun, 1=Mon, ...
  const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  const monday = new Date(date.setDate(diff));

  // Format to YYYY-MM-DD to use as a stable cache key
  // TODO : Use Format here
  return monday.toISOString().slice(0, 10);
};

/**
 * Returns a human-readable "time ago" string for a given date
 */
export const getTimeAgo = (dateString: string, t: (key: string, options?: any) => string): string => {
  const now = new Date();
  const date = new Date(dateString);
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return t("common.timeAgo.now");
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    const key = diffInMinutes === 1 ? "common.timeAgo.minute" : "common.timeAgo.minutes";
    return t(key, { count: diffInMinutes });
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    const key = diffInHours === 1 ? "common.timeAgo.hour" : "common.timeAgo.hours";
    return t(key, { count: diffInHours });
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    const key = diffInDays === 1 ? "common.timeAgo.day" : "common.timeAgo.days";
    return t(key, { count: diffInDays });
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    const key = diffInMonths === 1 ? "common.timeAgo.month" : "common.timeAgo.months";
    return t(key, { count: diffInMonths });
  }

  const diffInYears = Math.floor(diffInMonths / 12);
  const key = diffInYears === 1 ? "common.timeAgo.year" : "common.timeAgo.years";
  return t(key, { count: diffInYears });
};
