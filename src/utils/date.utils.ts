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
