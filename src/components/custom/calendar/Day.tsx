import { useTranslation } from "react-i18next";
import { Text } from "@/components/common/Text";
import CalendarCard from "@/components/custom/calendar/CalendarCard";
import { useTheme } from "@/contexts/ThemeContext";

interface DayCardProps {
  selected?: boolean;
  onPress?: (date: Date) => void;
  date: Date;
}

export const DayCard = ({ date, selected = false, onPress }: DayCardProps) => {
  const { t, i18n } = useTranslation();
  const { theme } = useTheme();
  const today = new Date().setHours(8, 0, 0, 0);
  date.setHours(8, 0, 0, 0);

  const isToday = date.getTime() === today;

  const handlePress = async () => {
    if (onPress) {
      onPress(date);
    }
  };

  const dayName = new Intl.DateTimeFormat(i18n.language, { weekday: "long" })
    .format(date)
    .substring(0, 3);

  const dayNumber = date.getDate();

  return (
    <CalendarCard
      className={"items-center justify-center"}
      backgroundColor={isToday ? `${theme.secondary}30` : theme.card}
      borderColor={selected ? theme.secondary : theme.border}
      onPress={handlePress}
    >
      <Text
        className="leading-none"
        style={selected ? { color: theme.secondary } : { color: theme.text }}
      >
        {dayName}
      </Text>
      <Text
        className="leading-none"
        style={selected ? { color: theme.secondary } : { color: theme.text }}
        variant="h1"
      >
        {dayNumber}
      </Text>
    </CalendarCard>
  );
};
