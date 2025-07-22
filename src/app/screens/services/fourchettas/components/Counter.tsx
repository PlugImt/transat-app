import { View } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { useEffect, useState } from "react";
import { CounterElement } from "@/components/custom/CounterElement";

interface CounterProps {
  date: Date;
}

function Counter({ date }: CounterProps) {
  const { theme } = useTheme();

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
  const hours = Math.floor((timediff / (1000 * 60 * 60)) % 24) - 2;
  const days = Math.floor(timediff / (1000 * 60 * 60 * 24));

  return (
    <View
      className={`flex-row-reverse items-center justify-between w-full ${timediff <= 0 ? "blur-md" : ""}`}
    >
      <CounterElement
        key={"sec"}
        displayed_number={seconds}
        direction="down"
        label="sec"
      />
      <CounterElement
        key={"min"}
        displayed_number={minutes}
        direction="down"
        label="min"
      />
      <CounterElement
        key={"hr"}
        displayed_number={hours}
        direction="down"
        label="heures"
      />
      <CounterElement
        key={"day"}
        displayed_number={days}
        direction="down"
        label="jours"
      />
    </View>
  );
}

export { Counter };
