import { View } from "react-native";
import { Text } from "@/components/common/Text";
import { useTheme } from "@/contexts/ThemeContext";
import type { CalendarEvent } from "@/dto";

interface ScheduleEventProps {
  event: CalendarEvent;
  isOver: boolean;
}

const formatTime = (time: string) => time.replace(":", "h");

const hasLocation = (location: string) =>
  location.trim() !== "" && location.trim() !== "-";

export const ScheduleEvent = ({ event, isOver }: ScheduleEventProps) => {
  const { theme } = useTheme();

  return (
    <View
      style={{ backgroundColor: theme.card, borderColor: theme.text }}
      className={`
        flex-col justify-center rounded-br-xl rounded-tr-2xl p-2 border-l-2 h-full gap-1
        ${isOver ? "opacity-60" : ""}
      `}
    >
      <Text className="font-bold" numberOfLines={3}>
        {event.name}
      </Text>
      <View className="flex-row flex-wrap items-center gap-2">
        <Text>
          {formatTime(event.startTime)} - {formatTime(event.endTime)}
        </Text>
        {hasLocation(event.location) && (
          <Text
            className="px-2 rounded-md text-center"
            style={{
              backgroundColor: theme.primary,
              color: theme.background,
            }}
            numberOfLines={1}
          >
            {event.location}
          </Text>
        )}
      </View>
    </View>
  );
};
