import { useEffect, useState } from "react";
import { View } from "react-native";
import { CounterElement } from "@/components/custom/CounterElement";
import { useTranslation } from "react-i18next";

interface CounterProps {
  date: Date;
}

function Counter({ date }: CounterProps) {
  const { t } = useTranslation();
  const currentDate = new Date();
  const [timediff, setTimediff] = useState(
    date.getTime() - currentDate.getTime(),
  );
  useEffect(() => {
    const interval = setInterval(() => {
      setTimediff((prev) => {
        if (prev <= 0) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const seconds = Math.floor((timediff / 1000) % 60);
  const minutes = Math.floor((timediff / (1000 * 60)) % 60);
  const hours =
    Math.floor((timediff / (1000 * 60 * 60)) % 24) +
    currentDate.getTimezoneOffset() / 60;
  const days = Math.floor(timediff / (1000 * 60 * 60 * 24));

  return (
    <View
      className={`flex-row-reverse items-center justify-between w-full ${
        timediff <= 0 ? "opacity-40" : ""
      }`}
    >
      <CounterElement
        key={"sec"}
        displayed_number={seconds}
        direction="down"
        label={t("services.fourchettas.seconds")}
      />
      <CounterElement
        key={"min"}
        displayed_number={minutes}
        direction="down"
        label={t("services.fourchettas.minutes")}
      />
      <CounterElement
        key={"hr"}
        displayed_number={hours}
        direction="down"
        label={t("services.fourchettas.hours")}
      />
      <CounterElement
        key={"day"}
        displayed_number={days}
        direction="down"
        label={t("services.fourchettas.days")}
      />
    </View>
  );
}

export { Counter };
