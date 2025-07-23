import { t } from "i18next";
import { useCallback, useEffect, useState } from "react";

const WASHING_MACHINE_DURATION = 40 * 60;
const DRYER_DURATION = 40 * 60;
const DRYER_DOUBLE_DURATION = 80 * 60;

export function useLaundryTimer(
  initialTimeLeft: number,
  icon: "WASHING MACHINE" | "DRYER",
) {
  const [timeRemaining, setTimeRemaining] = useState<number>(initialTimeLeft);
  const [progressPercentage, setProgressPercentage] = useState<number>(0);

  const formatTime = useCallback((seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m${remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds}`;
  }, []);

  const getMachineStatus = useCallback(
    (timeBeforeOff: number): string => {
      if (timeBeforeOff === 0) return t("common.freeToUse");
      return timeBeforeOff > 0 ? formatTime(timeBeforeOff) : t("common.error");
    },
    [formatTime],
  );

  useEffect(() => {
    if (timeRemaining > 0 && initialTimeLeft > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [initialTimeLeft, timeRemaining]);

  useEffect(() => {
    if (initialTimeLeft === 0) {
      setProgressPercentage(0);
      return;
    }

    let totalDuration = 0;
    if (icon === "WASHING MACHINE") {
      totalDuration = WASHING_MACHINE_DURATION;
    } else {
      totalDuration =
        timeRemaining > DRYER_DURATION ? DRYER_DOUBLE_DURATION : DRYER_DURATION;
    }

    const elapsed = totalDuration - timeRemaining;
    const progress = Math.min(
      Math.max((elapsed / totalDuration) * 100, 0),
      100,
    );
    setProgressPercentage(progress);
  }, [timeRemaining, initialTimeLeft, icon]);

  return {
    timeRemaining,
    setTimeRemaining,
    progressPercentage,
    formatTime,
    getMachineStatus,
  };
}
