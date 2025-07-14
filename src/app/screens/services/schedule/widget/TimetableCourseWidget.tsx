import { View } from "react-native";
import { TagCourseRoom } from "@/app/screens/services/schedule/components/TagCourseRoom";
import { Text } from "@/components/common/Text";
import { useTheme } from "@/contexts/ThemeContext";
import type { Course } from "@/dto";

export const TimetableCourseWidget = ({ course }: { course: Course }) => {
  const { theme } = useTheme();

  return (
    <View
      className="flex flex-col rounded-lg gap-1.5 py-2"
      style={{ backgroundColor: theme.card }}
    >
      <Text className="ml-4" ellipsizeMode="tail">
        {course.title}
      </Text>
      <View className="flex flex-row items-center gap-2">
        <Text className="ml-4" ellipsizeMode="tail">
          {course.start_time} - {course.end_time}
        </Text>
        <TagCourseRoom rooms={course.room} />
      </View>
    </View>
  );
};
