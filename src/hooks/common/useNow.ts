import { useEffect, useState } from "react";

/** Current date, refreshed every `intervalMs`. */
export const useNow = (intervalMs = 30_000): Date => {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  return now;
};
