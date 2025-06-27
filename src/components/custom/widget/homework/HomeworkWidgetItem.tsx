import { Text, View } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import type { Homework } from "@/types/homework";

export function HomeworkWidgetItem({ homework }: { homework: Homework }) {
  const { theme } = useTheme();

  const formatDateTime = (dateStr: Date | string) => {
    const date = new Date(dateStr);
    const day = date.toLocaleDateString(undefined, {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    const time = date.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    return `${day} - ${time}`;
  };

  return (
    <View
      className="flex flex-col rounded-lg gap-1.5 py-2"
      style={{ backgroundColor: theme.card }}
    >
      <Text
        className="text-base ml-4 font-medium"
        style={{ color: theme.text }}
        ellipsizeMode="tail"
      >
        {homework.title}
      </Text>
      <Text
        className="text-sm ml-4 italic"
        style={{ color: theme.text }}
        ellipsizeMode="tail"
      >
        {homework.course_name}
      </Text>
      <View className="flex flex-row items-center gap-2 ml-4">
        <Text
          className="text-sm"
          style={{ color: theme.primary }}
          ellipsizeMode="tail"
        >
          📅 {formatDateTime(homework.deadline)}
        </Text>
      </View>
    </View>
  );
}
