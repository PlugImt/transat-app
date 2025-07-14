import { View } from "react-native";
import { Text } from "@/components/common/Text";
import { useTheme } from "@/contexts/ThemeContext";
import type { Homework } from "@/dto";

export const HomeworkWidgetItem = ({ homework }: { homework: Homework }) => {
  const { theme } = useTheme();

  // TODO: Relocate this function to date.utils
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
      <Text className="ml-4" ellipsizeMode="tail">
        {homework.title}
      </Text>
      <Text className="ml-4" ellipsizeMode="tail">
        {homework.course_name}
      </Text>
      <View className="flex flex-row items-center gap-2 ml-4">
        <Text variant="sm" color="primary" ellipsizeMode="tail">
          📅 {formatDateTime(homework.deadline)}
        </Text>
      </View>
    </View>
  );
};
